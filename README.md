# Rider - Fullstack Ride-Booking Platform

A modern fullstack ride-booking web application built with **React (Vite)**, **TailwindCSS**, **Leaflet Maps**, **Express.js**, and **MongoDB**.

---

## 📁 Project Structure

```text
rider-main/
├── backend/                # Express & Node.js API server
│   ├── config/             # Database connection setup
│   ├── controllers/        # Route logic (drivers, users, rides)
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas (User, Driver, Ride)
│   ├── routes/             # API routes
│   ├── utils/              # Token & utility functions
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Server entry point
├── frontend/               # Vite + React frontend
│   ├── src/                # Components, pages, assets, utilities
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
├── package.json            # Root workspace scripts to manage both
└── README.md
```

---

## 🚀 Quick Start & Dependency Setup

### 1. Install All Dependencies

You can install all dependencies for both backend and frontend from the root directory with:

```bash
npm run install:all
```

Or install them individually:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

### 2. Environment Variables Setup

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update the values:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/rider
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

### 3. Running the Project

#### Run Backend:
```bash
npm run dev:backend
# or: cd backend && npm run dev
```
Backend runs on `http://localhost:5000`.

#### Run Frontend:
```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```
Frontend runs on `http://localhost:5173`.

#### Build Frontend for Production:
```bash
npm run build:frontend
```

---

## 🛠️ Tech Stack & Key Dependencies

### Backend
- **Express 5** – Web framework
- **Mongoose 9** – MongoDB ODM
- **JSONWebToken** – Authentication tokens
- **Bcrypt** – Password hashing
- **CORS & Dotenv** – Security and configuration

### Frontend
- **React 19 & Vite 8** – Fast frontend framework and tooling
- **Tailwind CSS 4** – Modern responsive styling
- **React Router 7** – Client-side routing
- **Leaflet & React-Leaflet** – Interactive maps and routing
- **Axios** – HTTP client
- **React Hot Toast** – Notification toasts
