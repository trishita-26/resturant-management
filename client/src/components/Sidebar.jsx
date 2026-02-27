import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ClipboardList,
    LogOut,
    Sun,
    Moon,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Menu', to: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside
            className="flex flex-col w-64 min-h-screen"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-color)',
            }}
        >
            {/* Brand */}
            <div className="px-6 py-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-1">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))' }}
                    >
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold bengali-title leading-tight" style={{ color: 'var(--text-primary)' }}>
                            The Bengali Bowl
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
                    </div>
                </div>
                {/* Bengali decorative divider */}
                <div className="mt-4 h-px w-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent), transparent)' }} />
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map(({ label, to, icon: Icon }) => {
                    const active = pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{
                                backgroundColor: active ? 'color-mix(in srgb, var(--brand) 15%, transparent)' : 'transparent',
                                color: active ? 'var(--brand)' : 'var(--text-secondary)',
                                border: active ? '1px solid color-mix(in srgb, var(--brand) 30%, transparent)' : '1px solid transparent',
                            }}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Theme + Logout */}
            <div className="px-4 pb-6 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                >
                    {theme === 'dark'
                        ? <Sun className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                        : <Moon className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                    }
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 10%, transparent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
