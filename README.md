
---

📄 README.md (ASSESSMENT READY)

# Multi-Tenant SaaS Platform – Project & Task Management System

## 📌 Project Overview
This is a **production-ready Multi-Tenant SaaS application** where multiple organizations (tenants) can independently manage users, projects, and tasks with **strict data isolation**, **role-based access control**, and **subscription plan enforcement**.

The system is fully **Dockerized** and can be started using **one command**.

---

## 🚀 Key Features
- Multi-tenant architecture with complete data isolation
- Subdomain-based tenant login
- JWT authentication (24-hour expiry)
- Role-based access control (Super Admin, Tenant Admin, User)
- Subscription plan limits (Free, Pro, Enterprise)
- Project and task management
- Audit logging
- Fully Dockerized backend, frontend, and database
- One-command deployment using Docker Compose

---

## 🧱 Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)

### Frontend
- React.js
- Axios
- React Router
- Context API

### DevOps
- Docker
- Docker Compose

---

## 🏗️ System Architecture

Browser ↓ Frontend (React) ↓ Backend API (Express) ↓ PostgreSQL Database

---

## 🔐 User Roles
| Role | Description |
|-----|------------|
| Super Admin | Manages all tenants |
| Tenant Admin | Manages users, projects, tasks within tenant |
| User | Regular user with limited permissions |

---

## 📦 API Overview
Total APIs Implemented: **19**

Modules:
- Authentication
- Tenant Management
- User Management
- Project Management
- Task Management
- System Health

📄 Complete API documentation available in `docs/API.md`

---

## 🐳 Docker Setup (MANDATORY)

### One Command Start
```bash
docker-compose up -d

Services

Service	Port

Database	5432
Backend	5000
Frontend	3000



---

🩺 Health Check

GET /api/health

Response:

{
  "status": "ok",
  "database": "connected"
}


---

🔑 Test Credentials (For Evaluation)

Super Admin

Email: superadmin@system.com
Password: Admin@123

Tenant Admin

Email: admin@testalpha.com
Password: TestPass@123
Tenant Subdomain: testalpha


---

📂 Project Structure

Backend

backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── middleware/
 │   ├── config/
 │   ├── utils/
 │   └── app.js
 ├── database/migrations/
 ├── Dockerfile
 └── server.js

Frontend

frontend/
 ├── src/
 │   ├── auth/
 │   ├── pages/
 │   ├── context/
 │   ├── api/
 │   ├── App.js
 │   └── index.js
 ├── Dockerfile
 └── package.json


---

📘 Documentation Included

Research Document

PRD

Architecture Document

API Documentation

Technical Specification



---

🎥 Demo

A complete demo video is provided separately as per submission requirements.


---

✅ Submission Checklist

✔ All 19 APIs implemented

✔ Data isolation enforced

✔ Dockerized backend, frontend, and database

✔ One-command deployment

✔ Health check endpoint working

✔ Seed data provided

✔ README and API documentation complete



---

👨‍💻 Author

B.N.S Harshitha
Multi-Tenant SaaS Assignment – 2026

---
