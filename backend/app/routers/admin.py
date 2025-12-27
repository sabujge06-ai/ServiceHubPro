from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.dependencies import get_current_admin
from app.models import Admin, User, Service, Subscription, Payment, PaymentChannel
from app.schemas import (
    AdminLogin,
    AdminResponse,
    UserResponse,
    ServiceCreate,
    ServiceResponse,
    SubscriptionCreate,
    SubscriptionResponse,
    PaymentResponse,
    PaymentChannelCreate,
    PaymentChannelUpdate,
    PaymentChannelResponse,
    PaymentReject
)
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/login", response_model=dict)
async def admin_login(credentials: AdminLogin, db: Session = Depends(get_db)):
    """Admin login."""
    admin = db.query(Admin).filter(Admin.email == credentials.email.lower()).first()
    
    if not admin or not verify_password(credentials.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is disabled"
        )
    
    access_token = create_access_token(
        data={"id": admin.id, "email": admin.email, "user_type": "admin"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "email": admin.email,
            "is_active": admin.is_active,
            "created_at": admin.created_at.isoformat()
        }
    }


# ==================== User Management ====================

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all users."""
    users = db.query(User).order_by(desc(User.created_at)).all()
    return users


@router.patch("/user/{user_id}/activate")
async def toggle_user_activation(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Toggle user activation status."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.is_user_active = not user.is_user_active
    db.commit()
    
    return {"message": f"User {'activated' if user.is_user_active else 'deactivated'} successfully"}


@router.patch("/user/{user_id}/verify")
async def verify_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Manually verify user."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.is_user_verified = True
    user.is_email_verified = True
    db.commit()
    
    return {"message": "User verified successfully"}


# ==================== Services Management ====================

@router.get("/services", response_model=List[ServiceResponse])
async def get_services(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all services."""
    services = db.query(Service).all()
    return services


@router.post("/service", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new service."""
    existing = db.query(Service).filter(Service.name == service_data.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Service already exists")
    
    service = Service(**service_data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/service/{service_id}/toggle")
async def toggle_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Toggle service active status."""
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    
    service.is_active = not service.is_active
    db.commit()
    
    return {"message": f"Service {'activated' if service.is_active else 'deactivated'} successfully"}


# ==================== Subscriptions Management ====================

@router.get("/subscriptions", response_model=List[SubscriptionResponse])
async def get_subscriptions(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all subscriptions."""
    subscriptions = db.query(Subscription).all()
    return subscriptions


@router.post("/subscription", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new subscription plan."""
    existing = db.query(Subscription).filter(Subscription.name == subscription_data.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Subscription already exists")
    
    subscription = Subscription(**subscription_data.model_dump())
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@router.patch("/subscription/{subscription_id}/toggle")
async def toggle_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Toggle subscription active status."""
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    
    subscription.is_active = not subscription.is_active
    db.commit()
    
    return {"message": f"Subscription {'activated' if subscription.is_active else 'deactivated'} successfully"}


# ==================== Payments Management ====================

@router.get("/payments", response_model=List[PaymentResponse])
async def get_payments(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all payments."""
    payments = db.query(Payment).order_by(desc(Payment.created_at)).all()
    return payments


@router.post("/payment/{payment_id}/approve")
async def approve_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Approve a pending payment."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    if payment.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment is not pending")
    
    # Update payment status
    payment.status = "approved"
    
    # Add balance to user
    user = db.query(User).filter(User.id == payment.user_id).first()
    if user:
        user.balance += payment.amount
    
    db.commit()
    
    return {"message": "Payment approved successfully"}


@router.post("/payment/{payment_id}/reject")
async def reject_payment(
    payment_id: int,
    reject_data: PaymentReject,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Reject a pending payment."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    if payment.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment is not pending")
    
    payment.status = "rejected"
    payment.reject_reason = reject_data.reject_reason
    db.commit()
    
    return {"message": "Payment rejected successfully"}


# ==================== Payment Channels Management ====================

@router.get("/payment-channels", response_model=List[PaymentChannelResponse])
async def get_payment_channels(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all payment channels."""
    channels = db.query(PaymentChannel).all()
    return channels


@router.post("/payment-channel", response_model=PaymentChannelResponse, status_code=status.HTTP_201_CREATED)
async def create_payment_channel(
    channel_data: PaymentChannelCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new payment channel."""
    existing = db.query(PaymentChannel).filter(PaymentChannel.name == channel_data.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment channel already exists")
    
    channel = PaymentChannel(**channel_data.model_dump())
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


@router.patch("/payment-channel/{channel_id}")
async def update_payment_channel(
    channel_id: int,
    update_data: PaymentChannelUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update a payment channel."""
    channel = db.query(PaymentChannel).filter(PaymentChannel.id == channel_id).first()
    
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment channel not found")
    
    if update_data.name is not None:
        channel.name = update_data.name
    if update_data.is_active is not None:
        channel.is_active = update_data.is_active
    
    db.commit()
    db.refresh(channel)
    
    return {"message": "Payment channel updated successfully"}


@router.delete("/payment-channel/{channel_id}")
async def delete_payment_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a payment channel."""
    channel = db.query(PaymentChannel).filter(PaymentChannel.id == channel_id).first()
    
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment channel not found")
    
    # Check if channel has payments
    payments_count = db.query(Payment).filter(Payment.channel_id == channel_id).count()
    if payments_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot delete channel with existing payments"
        )
    
    db.delete(channel)
    db.commit()
    
    return {"message": "Payment channel deleted successfully"}
