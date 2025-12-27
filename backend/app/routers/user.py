from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, get_current_active_user, get_current_verified_user
from app.models import User, Service, ServiceUsage, Subscription, UserSubscription, Payment, PaymentChannel
from app.schemas import (
    UserResponse,
    ServiceResponse,
    ServiceUsageResponse,
    ServiceUsageCreate,
    PaymentCreate,
    PaymentResponse,
    UserSubscriptionResponse,
    UserSubscriptionCreate,
    SubscriptionResponse
)
from app.core.config import settings

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.get("/services", response_model=List[ServiceResponse])
async def get_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all active services."""
    services = db.query(Service).filter(Service.is_active == True).all()
    return services


@router.post("/use-service", response_model=ServiceUsageResponse)
async def use_service(
    usage_data: ServiceUsageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user)
):
    """Use a service (costs 5 BDT or requires active subscription)."""
    # Check if service exists and is active
    service = db.query(Service).filter(
        Service.id == usage_data.service_id,
        Service.is_active == True
    ).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found or not active"
        )
    
    service_cost = settings.SERVICE_COST
    
    # Check if user has active subscription
    has_subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.is_active == True,
        UserSubscription.end_date >= datetime.utcnow()
    ).first()
    
    if not has_subscription:
        # Check balance
        if current_user.balance < service_cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient balance. Required: ৳{service_cost}, Available: ৳{current_user.balance}"
            )
        
        # Deduct balance
        current_user.balance -= service_cost
    else:
        # Free service with subscription
        service_cost = 0
    
    # Create usage record
    usage = ServiceUsage(
        user_id=current_user.id,
        service_id=service.id,
        cost=service_cost
    )
    
    db.add(usage)
    db.commit()
    db.refresh(usage)
    
    # Load service relationship
    usage.service = service
    
    return usage


@router.post("/add-payment", response_model=PaymentResponse)
async def add_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a payment for approval."""
    # Check if channel exists and is active
    channel = db.query(PaymentChannel).filter(
        PaymentChannel.id == payment_data.channel_id,
        PaymentChannel.is_active == True
    ).first()
    
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment channel not found or not active"
        )
    
    # Check for duplicate transaction ID
    existing_payment = db.query(Payment).filter(
        Payment.transaction_id == payment_data.transaction_id
    ).first()
    
    if existing_payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction ID already exists"
        )
    
    # Validate amount
    if payment_data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than 0"
        )
    
    # Create payment
    payment = Payment(
        user_id=current_user.id,
        channel_id=payment_data.channel_id,
        transaction_id=payment_data.transaction_id,
        amount=payment_data.amount,
        status="pending"
    )
    
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    payment.channel = channel
    
    return payment


@router.get("/payments", response_model=List[PaymentResponse])
async def get_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's payment history."""
    payments = db.query(Payment).filter(
        Payment.user_id == current_user.id
    ).order_by(desc(Payment.created_at)).all()
    
    return payments


@router.get("/subscriptions", response_model=List[UserSubscriptionResponse])
async def get_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's subscription history."""
    subscriptions = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id
    ).order_by(desc(UserSubscription.start_date)).all()
    
    return subscriptions


@router.get("/available-subscriptions", response_model=List[SubscriptionResponse])
async def get_available_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all available subscription plans."""
    subscriptions = db.query(Subscription).filter(Subscription.is_active == True).all()
    return subscriptions


@router.post("/buy-subscription", response_model=UserSubscriptionResponse)
async def buy_subscription(
    subscription_data: UserSubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user)
):
    """Buy a subscription plan."""
    # Get subscription
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_data.subscription_id,
        Subscription.is_active == True
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription plan not found or not active"
        )
    
    # Check balance
    if current_user.balance < subscription.price:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient balance. Required: ৳{subscription.price}, Available: ৳{current_user.balance}"
        )
    
    # Deactivate existing subscriptions
    db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.is_active == True
    ).update({"is_active": False})
    
    # Deduct balance
    current_user.balance -= subscription.price
    
    # Create user subscription
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=subscription.duration_days)
    
    user_subscription = UserSubscription(
        user_id=current_user.id,
        subscription_id=subscription.id,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )
    
    db.add(user_subscription)
    db.commit()
    db.refresh(user_subscription)
    
    user_subscription.subscription = subscription
    
    return user_subscription


@router.get("/payment-channels", response_model=List[dict])
async def get_payment_channels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get active payment channels."""
    channels = db.query(PaymentChannel).filter(PaymentChannel.is_active == True).all()
    return [{"id": c.id, "name": c.name, "is_active": c.is_active} for c in channels]
