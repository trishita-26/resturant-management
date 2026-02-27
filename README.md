# 🍛 The Bengali Bowl — Restaurant Management System

A full-stack **Restaurant Management System** themed around authentic Bengali cuisine, built with **Node.js + Express** (backend) and **React + Vite** (frontend).

---

## 📁 Project Structure

```
Resturat management/
├── servers/                  # Backend (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   └── personController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verify + generateToken
│   │   ├── errorHandler.js
│   │   ├── roleCheck.js
│   │   └── validate.js       # Joi validation
│   ├── models/
│   │   ├── Person.js
│   │   └── Menu.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   └── personRoutes.js
│   ├── validators/
│   │   ├── personValidator.js
│   │   └── menuValidator.js
│   ├── .env
│   ├── package.json
│   └── server.js             # Entry point — runs on port 3000
│
└── client/                   # Frontend (React + Vite + Tailwind CSS)
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx   # JWT auth state
    │   │   ├── CartContext.jsx   # Cart state
    │   │   └── ThemeContext.jsx  # Dark / Light theme
    │   ├── services/
    │   │   └── api.js            # Axios instances + all API calls
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── AdminLayout.jsx
    │   │   ├── Modal.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx         # Sign In + Sign Up tabs
    │   │   ├── DashboardPage.jsx
    │   │   ├── MenuManagementPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── PublicMenuPage.jsx
    │   │   └── CartPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css             # Bengali theme CSS variables
    ├── .env
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

---

### 1. Backend Setup

```bash
cd servers
npm install
```

Create / edit `servers/.env`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the server:
```bash
node --watch server.js
# Server running at http://localhost:3000
```

---

### 2. Frontend Setup

```bash
cd client
npm install
```

The `client/.env` is already configured:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the dev server:
```bash
npm run dev
# App running at http://localhost:5173
```

> **Important:** Start the backend first, then the frontend.

---

## 🌐 Routes & Pages

| URL | Page | Auth |
|---|---|---|
| `/` | 🍛 Public Menu (home) | Public |
| `/cart` | 🛒 Cart & Checkout | Public |
| `/login` | 🔐 Admin Login / Sign Up | Public |
| `/admin/dashboard` | 📊 Dashboard Stats | 🔒 JWT |
| `/admin/menu` | 🍽️ Menu CRUD | 🔒 JWT |
| `/admin/orders` | 📋 Orders | 🔒 JWT |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Create staff account |
| `POST` | `/api/auth/login` | Public | Get JWT token |
| `GET` | `/api/menu` | JWT | List all menu items |
| `POST` | `/api/menu` | JWT (manager) | Create menu item |
| `PUT` | `/api/menu/:id` | JWT (manager) | Update menu item |
| `DELETE` | `/api/menu/:id` | JWT (manager) | Delete menu item |
| `GET` | `/api/orders` | JWT | List all orders |
| `POST` | `/api/orders` | Public | Place a new order |
| `PUT` | `/api/orders/:id` | JWT | Update order status |
| `GET` | `/api/dashboard/stats` | JWT | Summary stats |
| `GET` | `/api/persons` | JWT | List staff |
| `PUT` | `/api/persons/:id` | JWT (manager) | Update staff |
| `DELETE` | `/api/persons/:id` | JWT (manager) | Delete staff |

---

## ✨ Features

### Frontend
- 🌗 **Dark / Light theme** — Bengali-themed warm palette, saved in localStorage
- 🔐 **JWT Authentication** — token auto-attached via Axios interceptor
- 🛡️ **Protected Routes** — admin pages redirect to `/login` if unauthenticated
- 📝 **Sign Up + Sign In** — tab-switcher on the login page
- 🍽️ **Menu Management** — full CRUD with search & modal form
- 📋 **Orders** — status filter, inline update, revenue totals
- 🛒 **Cart** — add/remove, qty controls, table number, order placement
- 🔔 **Toast notifications** — for all actions (including Bengali messages!)
- ⏳ **Loading states** — on all data fetches
- 📱 **Responsive** — works on mobile & desktop

### Backend
- 🔒 JWT-based auth with role checks (`manager` / `chef` / `waiter`)
- ✅ Joi request validation
- 🛡️ Helmet security headers
- 🚦 Rate limiting (100 req / 15 min per IP)
- 🌐 CORS enabled for frontend origins
- 🍃 MongoDB via Mongoose

---

## 🎨 Design

| Element | Value |
|---|---|
| Primary colour | Saffron / Turmeric gold |
| Accent colour | Bengali red |
| Dark background | Warm deep brown `#120c04` |
| Light background | Cream parchment `#fef9f0` |
| Title font | Tiro Bangla + Inter |
| Currency | Bengali Taka ৳ |

---

## 🗒️ Notes

- Staff roles: `manager` (full admin access), `chef`, `waiter`
- Only a `manager` can create/edit/delete menu items and manage staff
- Orders can be placed without authentication (public)
- The dashboard `/api/dashboard/stats` endpoint needs to be implemented in the backend if not already present
