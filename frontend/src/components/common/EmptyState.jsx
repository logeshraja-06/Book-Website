import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There are currently no records matching this section.',
  actionLabel,
  onAction,
  actionTo,
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-6 bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] space-y-4 max-w-md mx-auto my-8 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center text-[#D3968C] mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
          {title}
        </h3>
        <p className="text-xs text-[#6E6A67] leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel && (onAction || actionTo)) && (
        <div className="pt-2">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
