import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, UtensilsCrossed, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    return (
        <header
            className="sticky top-0 z-40 backdrop-blur-md"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--bg-surface) 92%, transparent)',
                borderBottom: '1px solid var(--border-color)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))' }}
                        >
                            <UtensilsCrossed className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold bengali-title leading-tight" style={{ color: 'var(--text-primary)' }}>
                                The Bengali Bowl
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Authentic Bengali Cuisine</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--brand)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Menu
                        </Link>
                        <Link to="/login" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--brand)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Admin
                        </Link>
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
                            style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark'
                                ? <Sun className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                                : <Moon className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                            }
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all btn-brand"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                                    style={{ backgroundColor: 'var(--accent)' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <nav className="md:hidden py-4 space-y-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Menu
                        </Link>
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Admin
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
