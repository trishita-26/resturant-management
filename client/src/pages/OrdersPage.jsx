import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOrders, updateOrderStatus } from '../services/api';
import toast from 'react-hot-toast';
import { DollarSign, Filter } from 'lucide-react';

const STATUSES = ['All', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'];

const STATUS_STYLES = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    preparing: 'bg-blue-500/15   text-blue-400   border-blue-500/30',
    ready: 'bg-green-500/15  text-green-400  border-green-500/30',
    delivered: 'bg-slate-500/15  text-slate-400  border-slate-500/30',
    cancelled: 'bg-red-500/15    text-red-400    border-red-500/30',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [updating, setUpdating] = useState(null);

    const fetchOrders = () => {
        setLoading(true);
        getOrders()
            .then((res) => setOrders(res.data))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        setUpdating(id);
        try {
            await updateOrderStatus(id, newStatus);
            setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: newStatus } : o));
            toast.success(`Order status updated to "${newStatus}"`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);
    const totalRevenue = filtered
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <p className="text-slate-400 text-sm mt-1">{filtered.length} orders shown</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-green-400 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    Revenue: ${totalRevenue.toFixed(2)}
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
                <Filter className="h-4 w-4 text-slate-500" />
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === s
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
                            <p className="text-slate-500">No orders found for this filter</p>
                        </div>
                    ) : (
                        filtered.map((order) => (
                            <div
                                key={order._id}
                                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="text-white font-semibold text-sm">
                                                Order #{order._id?.slice(-6).toUpperCase() || 'N/A'}
                                            </p>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown date'}
                                        </p>
                                        {/* Items list */}
                                        <ul className="mt-3 space-y-1">
                                            {(order.items || []).map((item, i) => (
                                                <li key={i} className="text-sm text-slate-400">
                                                    {item.name} × {item.quantity} —{' '}
                                                    <span className="text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <p className="text-white font-bold text-lg">
                                            ${Number(order.totalAmount || 0).toFixed(2)}
                                        </p>
                                        <select
                                            value={order.status}
                                            disabled={updating === order._id}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-all disabled:opacity-50"
                                        >
                                            {STATUSES.filter((s) => s !== 'All').map((s) => (
                                                <option key={s} value={s} className="capitalize">
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
