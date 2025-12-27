from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    usages = relationship("ServiceUsage", back_populates="service")
    
    def __repr__(self):
        return f"<Service(id={self.id}, name={self.name})>"


class ServiceUsage(Base):
    __tablename__ = "service_usages"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    cost = Column(Float, default=5.0)
    used_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="service_usages")
    service = relationship("Service", back_populates="usages")
    
    def __repr__(self):
        return f"<ServiceUsage(id={self.id}, user_id={self.user_id}, service_id={self.service_id})>"
