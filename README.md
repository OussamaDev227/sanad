# SANAD — سند | منصة جامعي

> منصة خدمات متكاملة للطلاب والأساتذة الجامعيين

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| State | Zustand |
| i18n | react-i18next (AR default / FR) |
| Routing | React Router v6 |
| Backend | Django 4.2 + Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Database | PostgreSQL |
| API Docs | drf-spectacular (Swagger) |

---

## 📁 Project Structure

```
sanad/
├── frontend/                  # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Topbar, MainLayout
│   │   │   └── ui/            # Reusable components
│   │   ├── pages/             # All page components
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── DashboardPage
│   │   │   ├── ServicesPage
│   │   │   ├── ServiceDetailPage
│   │   │   ├── CategoryPage
│   │   │   ├── RequestsPage
│   │   │   ├── ProfilePage
│   │   │   └── AdminPage
│   │   ├── i18n/
│   │   │   └── locales/       # ar.json, fr.json
│   │   ├── store/             # Zustand stores
│   │   └── services/          # API layer (axios)
│   └── package.json
│
└── backend/                   # Django project
    ├── sanad_project/         # Project config
    │   ├── settings.py
    │   └── urls.py
    ├── apps/
    │   ├── users/             # Custom User model + Auth
    │   ├── services_app/      # Service, Category models
    │   └── requests_app/      # Request, Notification models
    ├── seed_data.py           # Initial data seeder
    ├── manage.py
    └── requirements.txt
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

---

### 1. Clone & Setup

```bash
git clone <repo-url>
cd sanad
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DB credentials

# Create PostgreSQL database
createdb sanad_db

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed initial data
python seed_data.py

# Start server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
API Docs: **http://localhost:8000/api/docs/**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_URL if needed

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Demo Accounts

After seeding (`python seed_data.py`):

| Role | Email | Password |
|---|---|---|
| Admin | admin@sanad.dz | admin1234 |
| Provider | provider@sanad.dz | provider1234 |
| Student | student@sanad.dz | student1234 |

> In development mode (`DEV=true`), the frontend allows mock login without a backend — just enter any email/password.

---

## 🌍 API Endpoints

### Auth
```
POST   /api/auth/register/        Register new user
POST   /api/auth/login/           Login → returns JWT
GET    /api/auth/me/              Get current user
PATCH  /api/auth/me/update/       Update profile
POST   /api/auth/token/refresh/   Refresh JWT
```

### Services
```
GET    /api/services/             List services (+ search, filter, paginate)
POST   /api/services/             Create service (provider only)
GET    /api/services/:id/         Service detail
PATCH  /api/services/:id/         Update service
DELETE /api/services/:id/         Delete service
GET    /api/services/mine/        My services (provider)
POST   /api/services/:id/reviews/ Add review
GET    /api/services/categories/  All categories
```

### Requests
```
GET    /api/requests/             My requests
POST   /api/requests/             Create request
GET    /api/requests/:id/         Request detail
PATCH  /api/requests/:id/cancel/  Cancel request
GET    /api/requests/provider/    Incoming requests (provider)
PATCH  /api/requests/:id/status/  Update status (provider)
```

### Notifications
```
GET    /api/requests/notifications/       List notifications
PATCH  /api/requests/notifications/read/  Mark all as read
```

### Admin
```
GET    /api/auth/admin/users/       List all users
PATCH  /api/auth/admin/users/:id/   Update user
GET    /api/auth/admin/stats/       Platform statistics
```

---

## 🎨 Design System

**Colors:**
- Primary Blue: `#042C53` → `#378ADD`
- Accent Gold: `#EF9F27`
- Teal (stability): `#1D9E75`

**Typography:**
- Arabic: Cairo (Google Fonts)
- Latin/French: Inter

**Layouts:** RTL (Arabic default), LTR (French)

---

## 🗺️ Roles & Permissions

| Action | Student | Professor | Provider | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse services | ✓ | ✓ | ✓ | ✓ |
| Create request | ✓ | ✓ | ✓ | ✓ |
| Create service | ✗ | ✗ | ✓ | ✓ |
| Update request status | ✗ | ✗ | ✓ | ✓ |
| Admin dashboard | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Production Deployment

```bash
# 1) Backend checks
cd backend
python manage.py migrate
python manage.py collectstatic --noinput

# 2) Start backend with gunicorn
gunicorn sanad_project.wsgi:application --bind 0.0.0.0:8000 --workers 3

# 3) Frontend build
cd ../frontend
npm run build
```

### Environment variables (required in production)

- `SECRET_KEY`: required and must be unique/secret
- `DEBUG=False`
- `ALLOWED_HOSTS=your-domain.com`
- `CORS_ORIGINS=https://app.your-domain.com`
- `CSRF_TRUSTED_ORIGINS=https://app.your-domain.com`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `SECURE_SSL_REDIRECT=True`
- `SECURE_HSTS_SECONDS=31536000`
- `LOG_LEVEL=INFO`

### Health check

- Backend health endpoint: `GET /health/` → `{"status":"ok"}`

### Docker (optional)

```bash
# From repository root
docker compose up --build
```

> For Docker Compose, set `DB_HOST=db` in `backend/.env`.

### Suggested hosting

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: managed PostgreSQL (Render, Railway, Supabase, Neon)

---

## 🔮 Roadmap

- [ ] Real-time notifications (WebSocket / Django Channels)
- [ ] Chat between users and providers
- [ ] Payment integration (CIB / BaridiMob)
- [ ] Mobile app (React Native)
- [ ] Advanced search with Elasticsearch
- [ ] Email/SMS verification

---

Built with ❤️ for Algerian university students.
