from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentChannelBase(BaseModel):
    name: str


class PaymentChannelCreate(PaymentChannelBase):
    is_active: bool = True


class PaymentChannelUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class PaymentChannelResponse(PaymentChannelBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    channel_id: int
    transaction_id: str
    amount: float


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(BaseModel):
    id: int
    user_id: int
    channel_id: int
    channel: Optional[PaymentChannelResponse] = None
    transaction_id: str
    amount: float
    status: str
    reject_reason: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class PaymentApprove(BaseModel):
    pass


class PaymentReject(BaseModel):
    reject_reason: str
