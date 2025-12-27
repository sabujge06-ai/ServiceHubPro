from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    current_address = Column(Text, nullable=True)
    profile_image_url = Column(String(500), nullable=True)
    balance = Column(Float, default=0.0)
    last_generated_token = Column(String(255), nullable=True)
    otp = Column(String(6), nullable=True)
    is_user_verified = Column(Boolean, default=False)
    is_user_active = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    service_usages = relationship("ServiceUsage", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
    
    def can_use_service(self, service_cost: float = 5.0) -> bool:
        """Check if user can use a service."""
        if not self.is_user_active or not self.is_email_verified:
            return False
        
        # Check if user has active subscription
        for sub in self.subscriptions:
            if sub.is_active:
                return True
        
        # Check if user has enough balance
        return self.balance >= service_cost
