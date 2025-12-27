# Service Platform Backend

FastAPI + MySQL backend for the Service Platform.

## Requirements

- Python 3.10+
- MySQL 8.0+

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
pip install pydantic-settings  # Required for config
```

### 3. Configure Database

Create MySQL database:

```sql
CREATE DATABASE service_platform;
```

### 4. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/service_platform
SECRET_KEY=your-super-secret-key-minimum-32-characters
```

### 5. Run Seed Script (Optional)

Populate initial data:

```bash
python -m app.utils.seed
```

This creates:
- Admin: `admin@example.com` / `admin123`
- Default services
- Subscription plans
- Payment channels

### 6. Run Server

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Or
python -m app.main
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/{token}` - Verify email

### User
- `GET /api/user/profile` - Get profile
- `GET /api/user/services` - Get services
- `POST /api/user/use-service` - Use a service
- `POST /api/user/add-payment` - Submit payment
- `GET /api/user/payments` - Payment history
- `GET /api/user/subscriptions` - Subscription history
- `POST /api/user/buy-subscription` - Buy subscription

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/user/{id}/activate` - Toggle user activation
- `PATCH /api/admin/user/{id}/verify` - Verify user
- `GET /api/admin/services` - Get services
- `PATCH /api/admin/service/{id}/toggle` - Toggle service
- `GET /api/admin/subscriptions` - Get subscriptions
- `PATCH /api/admin/subscription/{id}/toggle` - Toggle subscription
- `GET /api/admin/payments` - Get payments
- `POST /api/admin/payment/{id}/approve` - Approve payment
- `POST /api/admin/payment/{id}/reject` - Reject payment
- `GET /api/admin/payment-channels` - Get channels
- `POST /api/admin/payment-channel` - Create channel
- `PATCH /api/admin/payment-channel/{id}` - Update channel
- `DELETE /api/admin/payment-channel/{id}` - Delete channel

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── database.py          # Database config
│   ├── dependencies.py      # Auth dependencies
│   ├── core/
│   │   ├── config.py        # Settings
│   │   └── security.py      # JWT & hashing
│   ├── models/
│   │   ├── admin.py
│   │   ├── user.py
│   │   ├── service.py
│   │   ├── subscription.py
│   │   └── payment.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── user.py
│   │   ├── service.py
│   │   ├── subscription.py
│   │   └── payment.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── admin.py
│   ├── services/
│   └── utils/
│       └── seed.py
├── .env
├── .env.example
├── requirements.txt
└── README.md
```
