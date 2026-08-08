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
    <div className={`text-center py-16 px-6 bg-[#FFFDF3] rounded-3xl border border-[#E9E5C8] space-y-4 max-w-md mx-auto my-8 shadow-2xs ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#F5F5DA] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D] mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
          {title}
        </h3>
        <p className="text-xs text-[#6B5E5E] leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel && (onAction || actionTo)) && (
        <div className="pt-2">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-semibold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-sm"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-semibold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
