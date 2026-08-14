export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAF8] bg-opacity-90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
