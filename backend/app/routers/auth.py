from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    generate_verification_token
)
from datetime import timedelta
from app.core.config import settings
from app.utils.email import send_verification_email  # Correct import

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate verification token
    verification_token = generate_verification_token()
    
    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        phone_number=user_data.phone_number,
        password=get_password_hash(user_data.password),
        current_address=user_data.current_address,
        last_generated_token=verification_token,
        is_user_verified=False,
        is_user_active=False,
        is_email_verified=False,
        is_phone_verified=False,
        balance=0.0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email
    send_verification_email(user_data.email, verification_token)
    
    return {
        "message": "Registration successful. Please verify your email and wait for admin approval.",
        "verification_token": verification_token  # Remove in production
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token."""
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"id": user.id, "email": user.email, "user_type": "user"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone_number": user.phone_number,
            "current_address": user.current_address,
            "profile_image_url": user.profile_image_url,
            "balance": user.balance,
            "is_user_verified": user.is_user_verified,
            "is_user_active": user.is_user_active,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "created_at": user.created_at.isoformat(),
            "updated_at": user.updated_at.isoformat()
        }
    }


@router.get("/verify-email/{token}")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email with token."""
    user = db.query(User).filter(User.last_generated_token == token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    user.is_email_verified = True
    user.last_generated_token = None
    db.commit()
    
    return {"message": "Email verified successfully. Please wait for admin to activate your account."}
