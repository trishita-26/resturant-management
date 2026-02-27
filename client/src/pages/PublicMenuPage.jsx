import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMenuItems } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides'];

// Bengali food category labels
const CATEGORY_LABELS = {
    All: 'All',
    Starters: 'Starters',
    'Main Course': 'Main Course',
    Desserts: 'Desserts',
    Beverages: 'Beverages',
    Sides: 'Sides',
};

export default function PublicMenuPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        getMenuItems()
            .then((res) => setItems(res.data.filter((i) => i.available)))
            .catch(() => toast.error('Failed to load menu'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = items.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || item.category === category;
        return matchSearch && matchCat;
    });

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
            <Navbar />

            {/* Hero */}
            <div
                className="py-16 px-4 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--brand) 15%, var(--bg-base)), var(--bg-base))' }}
            >
                {/* Decorative Bengali pattern text */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl opacity-5 pointer-events-none select-none font-bold bengali-title">
                    বাঙালি রান্না
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>
                    🍛 Authentic Bengali Cuisine · খাঁটি বাঙালি রান্না
                </p>
                <h1 className="text-4xl sm:text-5xl font-extrabold bengali-title mb-4" style={{ color: 'var(--text-primary)' }}>
                    Our Menu
                </h1>
                <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--text-muted)' }}>
                    Lovingly crafted recipes from Bengal, made with hand-picked spices and the warmth of tradition
                </p>
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="h-px w-16 rounded-full" style={{ backgroundColor: 'var(--brand)' }} />
                    <Flame className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    <div className="h-px w-16 rounded-full" style={{ backgroundColor: 'var(--brand)' }} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                {/* Search */}
                <div className="relative max-w-sm mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search dishes…"
                        className="theme-input pl-11"
                    />
                </div>

                {/* Category pills */}
                <div className="flex gap-2 flex-wrap mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{
                                backgroundColor: category === cat ? 'var(--brand)' : 'var(--bg-elevated)',
                                color: category === cat ? 'white' : 'var(--text-secondary)',
                                border: `1px solid ${category === cat ? 'var(--brand)' : 'var(--border-color)'}`,
                            }}
                        >
                            {CATEGORY_LABELS[cat] || cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.length === 0 ? (
                            <p className="col-span-full text-center py-16" style={{ color: 'var(--text-muted)' }}>No dishes found</p>
                        ) : (
                            filtered.map((item) => (
                                <div
                                    key={item._id}
                                    className="theme-card overflow-hidden flex flex-col group"
                                    style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                >
                                    {/* Image */}
                                    <div className="relative h-44 overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-5xl">🍛</div>
                                        )}
                                        <span
                                            className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full"
                                            style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 85%, transparent)', color: 'var(--text-secondary)', backdropFilter: 'blur(4px)' }}
                                        >
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                                        <p className="text-xs flex-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="font-bold text-base" style={{ color: 'var(--brand)' }}>৳{Number(item.price).toFixed(2)}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all btn-brand"
                                            >
                                                <ShoppingCart className="h-3.5 w-3.5" />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
