export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
    const sizeMap = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };
    const spinner = (
        <div
            className={`${sizeMap[size]} animate-spin rounded-full border-4 border-slate-700 border-t-orange-500`}
        />
    );
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80">
                {spinner}
            </div>
        );
    }
    return <div className="flex justify-center py-8">{spinner}</div>;
}
