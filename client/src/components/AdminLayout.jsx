import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
