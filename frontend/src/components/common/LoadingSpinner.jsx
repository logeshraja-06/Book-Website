export default function LoadingSpinner({ label = 'Loading…', progress }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#E7D9D3] border-t-[#D3968C] animate-spin" />
      <span className="text-xs font-mono text-[#6E6A67]">{label}</span>
      {typeof progress === 'number' && (
        <div className="w-48 h-1 bg-[#E7D9D3] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D3968C] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
