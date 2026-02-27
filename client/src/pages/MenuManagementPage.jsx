import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides'];
const EMPTY_FORM = { name: '', description: '', price: '', category: CATEGORIES[0], available: true, image: '' };

export default function MenuManagementPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchItems = () => {
        setLoading(true);
        getMenuItems()
            .then((res) => setItems(res.data))
            .catch(() => toast.error('Failed to load menu items'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchItems(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (item) => { setEditing(item); setForm({ ...item }); setModalOpen(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
        setSaving(true);
        try {
            if (editing) {
                await updateMenuItem(editing._id, form);
                toast.success('Menu item updated!');
            } else {
                await createMenuItem(form);
                toast.success('Menu item created!');
            }
            fetchItems();
            setModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await deleteMenuItem(id);
            toast.success('Item deleted');
            setItems((prev) => prev.filter((i) => i._id !== id));
        } catch {
            toast.error('Failed to delete item');
        }
    };

    const filtered = items.filter(
        (i) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                    <p className="text-slate-400 text-sm mt-1">{items.length} items total</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Add Item
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or category…"
                    className="w-full sm:max-w-xs bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No items found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg">🍽️</div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-white">{item.name}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">${Number(item.price).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.available ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {item.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, item.name)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu Item' : 'Add Menu Item'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">Name *</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Margherita Pizza"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
                            >
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                rows={2}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Short description…"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                            <input
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                placeholder="https://…"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="available"
                                checked={form.available}
                                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                                className="h-4 w-4 accent-orange-500"
                            />
                            <label htmlFor="available" className="text-sm text-slate-300">Available for order</label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-sm text-white font-medium transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
                            {saving ? 'Saving…' : editing ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
