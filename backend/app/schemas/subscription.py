from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubscriptionBase(BaseModel):
    name: str
    duration_days: int
    price: float


class SubscriptionCreate(SubscriptionBase):
    is_active: bool = True


class SubscriptionResponse(SubscriptionBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True


class UserSubscriptionCreate(BaseModel):
    subscription_id: int


class UserSubscriptionResponse(BaseModel):
    id: int
    user_id: int
    subscription_id: int
    subscription: Optional[SubscriptionResponse] = None
    start_date: datetime
    end_date: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
