import { useState } from 'react';
import { BookOpen } from 'lucide-react';

/**
 * Reusable, Graceful BookCover with Luxurious Paper Texture Fallback
 * Never shows broken image icons. Preserves true cover aspect ratio.
 */
export default function BookCover({
  book,
  variant = 'default', // 'default' | 'featured' | '3d' | 'shelf' | 'compact' | 'thumbnail' | 'horizontal'
  className = '',
  imageClassName = '',
  showShadow = true,
  alt,
}) {
  const [imageError, setImageError] = useState(false);
  const coverSrc = book?.coverImage || book?.coverUrl;

  const title = book?.title || 'Book Title';
  const author = book?.author || 'BookVerse Author';
  const genre = book?.genre || book?.category || 'Curated Literature';

  // Variant aspect ratios and sizing
  const variantStyles = {
    default: 'aspect-[3/4]',
    featured: 'aspect-[3/4] shadow-md',
    '3d': 'aspect-[3/4] book-card-3d',
    shelf: 'aspect-[2/3] shadow-md',
    compact: 'aspect-[3/4]',
    thumbnail: 'aspect-[3/4] w-12 h-16 shrink-0',
    horizontal: 'aspect-[3/4] w-full sm:w-32 shrink-0',
  };

  const baseAspect = variantStyles[variant] || variantStyles.default;

  if (imageError || !coverSrc) {
    return (
      <div
        className={`relative ${baseAspect} rounded-xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8] p-4 flex flex-col justify-between select-none ${className}`}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 30%, rgba(123,2,29,0.06), transparent 70%), linear-gradient(180deg, #FFFDF3 0%, #F5F5DA 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.18em] font-editorial-sans text-[#212842] font-bold">
            {genre}
          </span>
          <div className="w-5 h-5 rounded-md bg-[#E9E5C8]/60 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-[#212842]" />
          </div>
        </div>

        <div className="space-y-1 my-auto text-center px-1">
          <h5 className="font-editorial-serif text-[16px] font-bold text-[#211D1D] leading-tight line-clamp-3">
            {title}
          </h5>
          <p className="text-[11px] font-editorial-sans text-[#6B5E5E] truncate">
            {author}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E9E5C8] flex items-center justify-between text-[8px] font-mono text-[#6B5E5E] uppercase tracking-widest">
          <span>BookVerse</span>
          <span>BV-EDITION</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${baseAspect} rounded-r-xl rounded-l-xs overflow-hidden bg-[#F5F5DA] border border-[#E9E5C8]/80 ${
        showShadow ? 'shadow-md group-hover:shadow-xl' : ''
      } transition-all duration-400 ease-out ${className}`}
      style={{
        boxShadow: '3px 4px 14px -2px rgba(33, 29, 29, 0.14), inset -1px 0 2px rgba(0,0,0,0.15)',
      }}
    >
      {/* 3D Physical Spine Depth (Left Edge) */}
      <div className="book-spine-depth pointer-events-none" />

      {/* Paper Pages Edge Detail (Right Edge & Bottom Edge shadow) */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-l from-black/15 to-transparent pointer-events-none z-10" />
      <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-10" />

      <img
        src={coverSrc}
        alt={alt || title}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${imageClassName}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
