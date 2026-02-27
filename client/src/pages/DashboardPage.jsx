import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDashboardStats } from '../services/api';
import { ShoppingBag, DollarSign, UtensilsCrossed, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon: Icon, gradient, note }) {
    return (
        <div
            className="rounded-2xl p-6 flex items-center gap-5 transition-all"
            style={{
                background: gradient,
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
            }}
        >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
                <p className="text-sm text-white/70">{label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
                {note && (
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />{note}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then((res) => setStats(res.data))
            .catch(() => toast.error('Failed to load dashboard stats'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold bengali-title" style={{ color: 'var(--text-primary)' }}>
                    Dashboard
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Welcome back! Here's an overview of The Bengali Bowl.
                </p>
                <div className="mt-3 h-px w-24 rounded-full" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }} />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Orders"
                        value={stats?.totalOrders ?? '—'}
                        icon={ShoppingBag}
                        gradient="linear-gradient(135deg, #c47a08, #9a5e04)"
                        note="All time"
                    />
                    <StatCard
                        label="Total Revenue"
                        value={stats?.totalRevenue !== undefined ? `৳${Number(stats.totalRevenue).toFixed(2)}` : '—'}
                        icon={DollarSign}
                        gradient="linear-gradient(135deg, #15803d, #166534)"
                        note="All time"
                    />
                    <StatCard
                        label="Menu Items"
                        value={stats?.totalMenuItems ?? '—'}
                        icon={UtensilsCrossed}
                        gradient="linear-gradient(135deg, #b91c1c, #991b1b)"
                    />
                </div>
            )}
        </AdminLayout>
    );
}
