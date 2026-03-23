# TodoManager: Full-Stack Task Orchestration System

TodoManager is a robust, full-stack task management application featuring a high-performance **Django REST Framework** backend and a responsive **React (Vite + TypeScript)** frontend. The system provides secure, user-scoped task persistence with a modern, glassmorphic UI.

---

## 🏗️ Architecture Overview

The system follows a decoupled Client-Server architecture:

-   **Backend**: A RESTful API built with Python/Django, handling authentication and business logic.
-   **Frontend**: A SPA (Single Page Application) built with React, consuming the backend API and managing state locally.
-   **Communication**: Secure JSON exchange over HTTP, protected by JWT (JSON Web Tokens).

---

## 🛠️ Technology Stack

### Backend (Django)
-   **Core Framework**: Django 6.0.3
-   **API Layer**: Django REST Framework (DRF)
-   **Security**: `djangorestframework-simplejwt` (Stateless Token Authentication)
-   **Middleware**: `django-cors-headers` for seamless cross-origin integration.
-   **Persistence**: SQLite3 (Scalable to PostgreSQL/MySQL via `settings.py`).
-   **Schema**:
    -   **Authentication**: standard `django.contrib.auth` with custom registration.
    -   **Task Model**: Uses `UUID4` as primary identifiers. Fields include `title`, `description`, `category` (Work, Personal, etc.), `priority` (High/Medium/Low), `status`, `dueDate`, and timestamp tracking (`createdAt`, `completedAt`).

### Frontend (React)
-   **Environment**: Vite + TypeScript
-   **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives).
-   **State Management**: Optimized React Context API
    -   `AuthContext`: Manages JWT lifecycle and user identity.
    -   `TaskContext`: Handles CRUD operations with **Optimistic Updates** for zero-latency UX.
    -   `ThemeContext`: Seamless Dark/Light mode orchestration.
-   **Visuals**: Lucide Icons & Framer Motion for micro-animations.

---

## 🚀 Integration Details

### 1. User Authentication Flow
The application implements a stateless JWT authentication system:
1.  **Registration**: User details are POSTed to `/api/register/`.
2.  **Login**: Credentials are sent to `/api/token/`, returning `access` and `refresh` tokens.
3.  **Scoped Data**: The backend `TaskViewSet` utilizes `IsAuthenticated` permissions. The `get_queryset` method is overridden to ensure users only interact with tasks linked to their profile:
    ```python
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    ```

### 2. Frontend API Consuming
All frontend API calls are centralized in the `TaskContext`. Requests automatically inject the JWT Access Token into the `Authorization` header:
```javascript
headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
```

### 3. Smart Greetings
The system extracts user identity during login and persists it locally. This allows the dashboard to provide high-quality, personalized greetings (e.g., *"Good evening, Akshaya 👋"*) while maintaining backend performance.

---

## ⚙️ Installation & Setup

### Prerequisites
-   Python 3.10+
-   Node.js (LTS) & Bun (recommended) or npm

### Backend Setup
1.  Navigate to `backend/`
2.  Create virtual environment: `python -m venv venv`
3.  Activate: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4.  Install dependencies: `pip install django djangorestframework django-cors-headers djangorestframework-simplejwt`
5.  Run migrations: `python manage.py migrate`
6.  Start server: `python manage.py runserver`

### Frontend Setup
1.  Navigate to `flow-state-tasks/`
2.  Install packages: `bun install` or `npm install`
3.  Run development server: `bun run dev` or `npm run dev`

---

## 🌩️ Deployment Guide

### Frontend (Vercel)
The React frontend is optimized for **Vercel**:
1.  Connect your GitHub repository to Vercel.
2.  Set the Root Directory to `flow-state-tasks/`.
3.  Add the Environment Variable: `VITE_API_URL` (point this to your deployed backend URL + `/api/tasks/`).
4.  Vercel will automatically use the `vercel.json` provided for SPA routing.

### Backend (Render / Railway / Heroku)
Since Django requires a persistent database and a server process, we recommend **Render** or **Railway**:
1.  Deploy the `backend/` directory.
2.  Ensure `requirements.txt` is installed.
3.  Set environment variables for `SECRET_KEY` and `ALLOWED_HOSTS`.
4.  Use a managed PostgreSQL database instead of SQLite for production data persistence.

---

*Developed with a focus on Code Quality, Security, and Premium User Experience.*
