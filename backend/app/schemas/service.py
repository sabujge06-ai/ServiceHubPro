from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceBase(BaseModel):
    name: str


class ServiceCreate(ServiceBase):
    is_active: bool = True


class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True


class ServiceUsageCreate(BaseModel):
    service_id: int


class ServiceUsageResponse(BaseModel):
    id: int
    user_id: int
    service_id: int
    service: Optional[ServiceResponse] = None
    cost: float
    used_at: datetime
    
    class Config:
        from_attributes = True
