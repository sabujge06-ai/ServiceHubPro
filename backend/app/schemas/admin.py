from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class AdminBase(BaseModel):
    email: EmailStr


class AdminCreate(AdminBase):
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(AdminBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
