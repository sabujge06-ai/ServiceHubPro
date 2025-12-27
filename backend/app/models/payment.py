from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class PaymentChannel(Base):
    __tablename__ = "payment_channels"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    payments = relationship("Payment", back_populates="channel")
    
    def __repr__(self):
        return f"<PaymentChannel(id={self.id}, name={self.name})>"


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel_id = Column(Integer, ForeignKey("payment_channels.id", ondelete="CASCADE"), nullable=False)
    transaction_id = Column(String(255), unique=True, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default=PaymentStatus.PENDING.value)
    reject_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="payments")
    channel = relationship("PaymentChannel", back_populates="payments")
    
    def __repr__(self):
        return f"<Payment(id={self.id}, transaction_id={self.transaction_id})>"
