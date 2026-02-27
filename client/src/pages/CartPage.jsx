import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [placing, setPlacing] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
        if (!tableNumber) { toast.error('Please enter your table number'); return; }
        setPlacing(true);
        try {
            const orderData = {
                items: cartItems.map((i) => ({ menuItem: i._id, name: i.name, quantity: i.quantity, price: i.price })),
                totalAmount: total,
                tableNumber,
            };
            await createOrder(orderData);
            clearCart();
            toast.success('অর্ডার দেওয়া হয়েছে! Order placed! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order.');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm mb-8 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Menu
                </button>

                <h1 className="text-2xl font-bold bengali-title mb-2" style={{ color: 'var(--text-primary)' }}>Your Cart · আপনার কার্ট</h1>
                <div className="h-px w-20 mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }} />

                {cartItems.length === 0 ? (
                    <div className="theme-card p-16 text-center">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
                        <button onClick={() => navigate('/')} className="btn-brand mt-6">Browse Menu</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="theme-card flex items-center gap-4 p-4">
                                    {item.image
                                        ? <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                                        : <div className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: 'var(--bg-elevated)' }}>🍛</div>
                                    }
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                        <p className="text-sm" style={{ color: 'var(--brand)' }}>৳{Number(item.price).toFixed(2)} each</p>
                                    </div>
                                    {/* Qty controls */}
                                    <div className="flex items-center gap-2">
                                        {[Minus, null, Plus].map((Comp, i) => Comp ? (
                                            <button key={i} onClick={() => updateQuantity(item._id, item.quantity + (i === 0 ? -1 : 1))}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg transition-all" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                                <Comp className="h-3 w-3" />
                                            </button>
                                        ) : (
                                            <span key={i} className="w-6 text-center text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-semibold w-16 text-right" style={{ color: 'var(--text-primary)' }}>
                                        ৳{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button onClick={() => removeFromCart(item._id)} className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                                        style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 10%, transparent)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="theme-card p-6 sticky top-24 h-fit">
                            <h2 className="text-lg font-semibold bengali-title mb-5" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>
                            <div className="mb-5">
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Table Number *</label>
                                <input type="number" min="1" value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 5" className="theme-input" />
                            </div>
                            <div className="space-y-2 mb-5">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>৳{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <div className="flex justify-between font-bold mb-6">
                                    <span style={{ color: 'var(--text-primary)' }}>Total</span>
                                    <span className="text-lg" style={{ color: 'var(--brand)' }}>৳{total.toFixed(2)}</span>
                                </div>
                                <button onClick={handlePlaceOrder} disabled={placing}
                                    className="btn-brand w-full flex items-center justify-center gap-2">
                                    {placing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ShoppingBag className="h-4 w-4" />}
                                    {placing ? 'Placing…' : 'Place Order'}
                                </button>
                                <button onClick={() => { clearCart(); toast('Cart cleared'); }}
                                    className="w-full mt-3 py-2.5 text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
