"""
Seed script to populate initial data.
Run: python -m app.utils.seed
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models import Admin, Service, Subscription, PaymentChannel
from app.core.security import get_password_hash


def seed_admin(db: Session):
    """Create default admin user."""
    admin_email = "admin@example.com"
    existing = db.query(Admin).filter(Admin.email == admin_email).first()
    
    if not existing:
        admin = Admin(
            email=admin_email,
            password=get_password_hash("admin123"),
            is_active=True
        )
        db.add(admin)
        db.commit()
        print(f"✓ Admin created: {admin_email} / admin123")
    else:
        print(f"→ Admin already exists: {admin_email}")


def seed_services(db: Session):
    """Create default services."""
    services = [
        "API Access",
        "Data Export",
        "Premium Support",
        "Analytics Dashboard",
        "Custom Reports"
    ]
    
    for name in services:
        existing = db.query(Service).filter(Service.name == name).first()
        if not existing:
            service = Service(name=name, is_active=True)
            db.add(service)
            print(f"✓ Service created: {name}")
        else:
            print(f"→ Service exists: {name}")
    
    db.commit()


def seed_subscriptions(db: Session):
    """Create default subscription plans."""
    subscriptions = [
        {"name": "Brins", "duration_days": 30, "price": 299.0},
        {"name": "Starter", "duration_days": 7, "price": 99.0},
        {"name": "Basic", "duration_days": 15, "price": 149.0},
        {"name": "Advanced", "duration_days": 45, "price": 399.0},
        {"name": "Pro", "duration_days": 60, "price": 499.0},
        {"name": "Ultimate", "duration_days": 90, "price": 699.0},
    ]
    
    for sub_data in subscriptions:
        existing = db.query(Subscription).filter(Subscription.name == sub_data["name"]).first()
        if not existing:
            subscription = Subscription(**sub_data, is_active=True)
            db.add(subscription)
            print(f"✓ Subscription created: {sub_data['name']}")
        else:
            print(f"→ Subscription exists: {sub_data['name']}")
    
    db.commit()


def seed_payment_channels(db: Session):
    """Create default payment channels."""
    channels = ["bKash", "Nagad", "Rocket", "Bank Transfer"]
    
    for name in channels:
        existing = db.query(PaymentChannel).filter(PaymentChannel.name == name).first()
        if not existing:
            channel = PaymentChannel(name=name, is_active=True)
            db.add(channel)
            print(f"✓ Payment channel created: {name}")
        else:
            print(f"→ Payment channel exists: {name}")
    
    db.commit()


def run_seed():
    """Run all seed functions."""
    print("\n" + "="*50)
    print("🌱 Starting database seed...")
    print("="*50 + "\n")
    
    # Initialize database tables
    init_db()
    print("✓ Database tables initialized\n")
    
    # Create session
    db = SessionLocal()
    
    try:
        seed_admin(db)
        print()
        seed_services(db)
        print()
        seed_subscriptions(db)
        print()
        seed_payment_channels(db)
        print()
        print("="*50)
        print("✅ Seeding completed successfully!")
        print("="*50 + "\n")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
