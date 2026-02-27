import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ─── Authenticated API (admin routes) ────────────────────────────────────────
const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Only redirect to /login on 401 for authenticated (admin) routes
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── Public API (no auth required — for public menu, placing orders) ─────────
const PublicAPI = axios.create({ baseURL: BASE });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = (data) => PublicAPI.post('/auth/login', data);
export const signupUser = (data) => PublicAPI.post('/auth/signup', data);

// ─── Menu ─────────────────────────────────────────────────────────────────────
// Public read — uses unauthenticated instance so 401 doesn't redirect to login
export const getMenuItems = () => PublicAPI.get('/menu');
export const createMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// ─── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = () => API.get('/orders');
export const createOrder = (data) => PublicAPI.post('/orders', data);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;
