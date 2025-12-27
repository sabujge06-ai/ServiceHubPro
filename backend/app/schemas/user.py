from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    current_address: Optional[str] = None


class UserCreate(UserBase):
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_gmail(cls, v: str) -> str:
        if not v.endswith('@gmail.com'):
            raise ValueError('Only Gmail addresses are allowed')
        return v.lower()
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Remove spaces and dashes
        cleaned = re.sub(r'[\s\-]', '', v)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError('Invalid phone number format')
        return cleaned


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    current_address: Optional[str] = None
    profile_image_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    profile_image_url: Optional[str] = None
    balance: float
    is_user_verified: bool
    is_user_active: bool
    is_email_verified: bool
    is_phone_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
