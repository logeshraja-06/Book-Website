export default function SkeletonCard({ type = 'book' }) {
  if (type === 'author') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F4EEEA] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-[#F4EEEA] rounded w-3/4" />
            <div className="h-3 bg-[#F4EEEA] rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-[#F4EEEA] rounded w-full" />
        <div className="h-3 bg-[#F4EEEA] rounded w-5/6" />
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] shadow-sm animate-pulse space-y-4">
        <div className="h-32 rounded-xl bg-[#F4EEEA] w-full" />
        <div className="h-5 bg-[#F4EEEA] rounded w-2/3" />
        <div className="h-3 bg-[#F4EEEA] rounded w-full" />
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 aspect-[3/4] rounded-3xl bg-[#F4EEEA]" />
          <div className="lg:col-span-7 space-y-6">
            <div className="h-4 bg-[#F4EEEA] rounded w-24" />
            <div className="h-10 bg-[#F4EEEA] rounded w-3/4" />
            <div className="h-4 bg-[#F4EEEA] rounded w-1/3" />
            <div className="h-24 bg-[#F4EEEA] rounded w-full" />
            <div className="h-12 bg-[#F4EEEA] rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Book card
  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] shadow-sm animate-pulse space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-3">
        <div className="aspect-[3/4] rounded-xl bg-[#F4EEEA] w-full" />
        <div className="h-3 bg-[#F4EEEA] rounded w-1/3" />
        <div className="h-5 bg-[#F4EEEA] rounded w-4/5" />
        <div className="h-3 bg-[#F4EEEA] rounded w-1/2" />
      </div>
      <div className="pt-4 border-t border-[#E7D9D3] flex justify-between items-center">
        <div className="h-5 bg-[#F4EEEA] rounded w-16" />
        <div className="h-4 bg-[#F4EEEA] rounded w-12" />
      </div>
    </div>
  );
}
