# 🍽️ Restaurant Management System — Frontend

A modern, full-featured Restaurant Management System built with **React + Vite**, **Tailwind CSS**, **Axios**, and **React Router DOM**.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework & build tool |
| Tailwind CSS v4 | Styling |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx   # Sidebar + content wrapper
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx         # Reusable modal
│   │   ├── Navbar.jsx        # Public navbar with cart badge
│   │   └── Sidebar.jsx       # Admin sidebar
│   ├── context/
│   │   ├── AuthContext.jsx   # JWT auth state
│   │   └── CartContext.jsx   # Cart state
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── MenuManagementPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── PublicMenuPage.jsx
│   │   └── CartPage.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   └── api.js            # Axios instance + API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── vite.config.js
└── tailwind.config.js
```

---

## Getting Started

### 1. Install dependencies
```bash
cd client
npm install
```

### 2. Configure environment
```bash
# .env (already created)
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the dev server
```bash
npm run dev
```

The app runs at **http://localhost:3000**

> Make sure your backend is running at `http://localhost:5000`

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Public Menu | Public |
| `/cart` | Cart & Checkout | Public |
| `/login` | Admin Login | Public |
| `/admin/dashboard` | Dashboard | 🔒 Admin |
| `/admin/menu` | Menu Management | 🔒 Admin |
| `/admin/orders` | Orders | 🔒 Admin |

---

## Features

- ✅ **JWT Authentication** — token stored in `localStorage`, auto-attached via Axios interceptor
- ✅ **Protected Routes** — admin pages redirect to `/login` if unauthenticated  
- ✅ **Menu Management** — full CRUD with add/edit modal and search
- ✅ **Orders Page** — live status updates, filter by status, revenue total
- ✅ **Public Menu** — category filter, search, add to cart
- ✅ **Cart** — quantity controls, remove items, order placement with table number
- ✅ **Loading states** on all data fetches  
- ✅ **Toast notifications** for all actions  
- ✅ **Dark mode** UI throughout  
- ✅ **Responsive** on all screen sizes  

---

## Backend API Expected Endpoints

```
POST   /api/auth/login
GET    /api/menu
POST   /api/menu              (auth)
PUT    /api/menu/:id           (auth)
DELETE /api/menu/:id           (auth)
GET    /api/orders             (auth)
POST   /api/orders
PUT    /api/orders/:id         (auth)
GET    /api/dashboard/stats    (auth)
```
