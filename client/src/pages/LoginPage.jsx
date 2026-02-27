import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../services/api';
import toast from 'react-hot-toast';
import { UtensilsCrossed, User, Lock, Eye, EyeOff, Phone, MapPin, Briefcase } from 'lucide-react';

const WORK_TYPES = ['manager', 'chef', 'waiter'];

export default function LoginPage() {
    const [tab, setTab] = useState('login'); // 'login' | 'signup'

    // Login state
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [showLoginPwd, setShowLoginPwd] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Signup state
    const [signupForm, setSignupForm] = useState({
        name: '', username: '', email: '', password: '',
        mobile: '', age: '', work: 'waiter', address: '', salary: '',
    });
    const [showSignupPwd, setShowSignupPwd] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // ── Login submit ────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginForm.username || !loginForm.password) { toast.error('Please fill in all fields'); return; }
        setLoginLoading(true);
        try {
            await login(loginForm.username, loginForm.password);
            toast.success('স্বাগতম! Welcome back!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoginLoading(false);
        }
    };

    // ── Signup submit ───────────────────────────────────────────
    const handleSignup = async (e) => {
        e.preventDefault();
        const required = ['name', 'username', 'email', 'password', 'mobile', 'age', 'address', 'salary'];
        if (required.some((f) => !signupForm[f])) { toast.error('Please fill in all required fields'); return; }
        setSignupLoading(true);
        try {
            await signupUser({
                ...signupForm,
                age: Number(signupForm.age),
                salary: Number(signupForm.salary),
            });
            toast.success('Account created! Please sign in.');
            setTab('login');
            setLoginForm({ username: signupForm.username, password: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Signup failed');
        } finally {
            setSignupLoading(false);
        }
    };

    const sf = (field) => (e) => setSignupForm((p) => ({ ...p, [field]: e.target.value }));

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: 'var(--bg-base)' }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--brand) 12%, transparent) 0%, transparent 65%)' }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-7">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', boxShadow: '0 8px 32px color-mix(in srgb, var(--brand) 40%, transparent)' }}>
                        <UtensilsCrossed className="h-9 w-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bengali-title" style={{ color: 'var(--text-primary)' }}>The Bengali Bowl</h1>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Admin Portal · রেস্তোরাঁ পরিচালনা</p>
                </div>

                {/* Card */}
                <div className="theme-card p-8">
                    {/* Bengali accent top line */}
                    <div className="h-1 w-full rounded-full mb-6" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent), var(--brand))' }} />

                    {/* Tabs */}
                    <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        {['login', 'signup'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className="flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all"
                                style={{
                                    backgroundColor: tab === t ? 'var(--brand)' : 'transparent',
                                    color: tab === t ? 'white' : 'var(--text-muted)',
                                }}
                            >
                                {t === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {/* ── LOGIN FORM ── */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                    <input type="text" value={loginForm.username}
                                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="your_username" className="theme-input pl-11" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                    <input type={showLoginPwd ? 'text' : 'password'} value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        placeholder="••••••••" className="theme-input pl-11 pr-10" />
                                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                                        {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loginLoading} className="btn-brand w-full flex items-center justify-center gap-2 mt-2">
                                {loginLoading
                                    ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</>
                                    : 'Sign In →'
                                }
                            </button>
                            <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                                No account?{' '}
                                <button type="button" onClick={() => setTab('signup')} style={{ color: 'var(--brand)' }} className="font-medium">
                                    Create one
                                </button>
                            </p>
                        </form>
                    )}

                    {/* ── SIGNUP FORM ── */}
                    {tab === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {/* Full name */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Full Name *</label>
                                    <input value={signupForm.name} onChange={sf('name')} placeholder="e.g. Trishita" className="theme-input" />
                                </div>
                                {/* Username */}
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Username *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                                        <input value={signupForm.username} onChange={sf('username')} placeholder="username" className="theme-input pl-11" />
                                    </div>
                                </div>
                                {/* Age */}
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Age *</label>
                                    <input type="number" min="18" value={signupForm.age} onChange={sf('age')} placeholder="e.g. 28" className="theme-input" />
                                </div>
                                {/* Email */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                                    <input type="email" value={signupForm.email} onChange={sf('email')} placeholder="you@example.com" className="theme-input" />
                                </div>
                                {/* Password */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                                        <input type={showSignupPwd ? 'text' : 'password'} value={signupForm.password} onChange={sf('password')}
                                            placeholder="••••••••" className="theme-input pl-11 pr-9" />
                                        <button type="button" onClick={() => setShowSignupPwd(!showSignupPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                                            {showSignupPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                {/* Work / Role */}
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Role *</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                                        <select value={signupForm.work} onChange={sf('work')} className="theme-input pl-11 appearance-none">
                                            {WORK_TYPES.map((w) => <option key={w} value={w} className="capitalize">{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {/* Mobile */}
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Mobile *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                                        <input value={signupForm.mobile} onChange={sf('mobile')} placeholder="+91..." className="theme-input pl-11" />
                                    </div>
                                </div>
                                {/* Salary */}
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Salary (৳) *</label>
                                    <input type="number" min="0" value={signupForm.salary} onChange={sf('salary')} placeholder="e.g. 15000" className="theme-input" />
                                </div>
                                {/* Address */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}> Address *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                                        <textarea rows={2} value={signupForm.address} onChange={sf('address')}
                                            placeholder="Kolkata, West Bengal" className="theme-input pl-11 resize-none" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={signupLoading} className="btn-brand w-full flex items-center justify-center gap-2">
                                {signupLoading
                                    ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Creating account…</>
                                    : 'Create Account →'
                                }
                            </button>
                            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                                Already have an account?{' '}
                                <button type="button" onClick={() => setTab('login')} style={{ color: 'var(--brand)' }} className="font-medium">Sign in</button>
                            </p>
                        </form>
                    )}
                </div>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
                    The Bengali Bowl © {new Date().getFullYear()} · Authentic Bengali Cuisine
                </p>
            </div>
        </div>
    );
}
