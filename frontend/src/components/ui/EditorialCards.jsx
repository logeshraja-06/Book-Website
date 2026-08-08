import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Feather,
  Quote,
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from '../book/BookCover';

/* =========================================================================
   1. FEATURED BOOK CARD (Editor's Spotlight Split Composition)
   ========================================================================= */
export function FeaturedBookCard({ book, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-[#520014]/[0.08] transition-all duration-400 group relative overflow-hidden ${className}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E5C8] text-xs">
          <span className="px-3 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#7B021D] text-[11px] font-editorial-sans font-bold tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#7B021D]" />
            Editor's Spotlight
          </span>
          <span className="font-mono text-[11px] text-[#6B5E5E] tracking-wider">
            {book.isbn ? `ISBN ${book.isbn}` : 'CATALOGUE #BV-5401'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          <Link
            to={`/books/${bookSlug}`}
            className="sm:col-span-5 block relative group/cover"
          >
            <BookCover book={book} variant="featured" imageClassName="group-hover/cover:scale-105" />
          </Link>

          <div className="sm:col-span-7 space-y-3">
            <Link
              to={`/categories/${categorySlug}`}
              className="text-[11px] uppercase tracking-[0.14em] font-editorial-sans text-[#7B021D] font-bold hover:underline block"
            >
              {book.genre || book.category}
            </Link>

            <Link to={`/books/${bookSlug}`}>
              <h3 className="font-editorial-serif text-2xl sm:text-[26px] font-semibold tracking-tight text-[#211D1D] leading-[1.2] group-hover:text-[#7B021D] transition-colors duration-300">
                {book.title}
              </h3>
            </Link>

            <p className="text-[14px] font-editorial-sans text-[#6B5E5E]">
              By{' '}
              <Link
                to={`/authors/${authorSlug}`}
                className="text-[#211D1D] font-semibold hover:text-[#7B021D] transition-colors"
              >
                {book.author}
              </Link>
            </p>

            <p className="text-[13px] text-[#6B5E5E] leading-relaxed font-sans line-clamp-3 italic pt-1">
              "{book.synopsis}"
            </p>

            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-[#6B5E5E]">
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5F5DA] border border-[#E9E5C8]">
                Hardcover Edition
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5F5DA] border border-[#E9E5C8]">
                {book.pages || 540} Pages
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E9E5C8] flex items-center justify-between mt-6">
        <div>
          <span className="text-[11px] font-editorial-sans uppercase tracking-wider text-[#6B5E5E] block font-semibold">
            Editorial Edition
          </span>
          <span className="font-editorial-sans font-tabular text-2xl font-bold tracking-tight text-[#211D1D]">
            {formatPrice(book.price)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(book.id || book._id);
            }}
            className={`p-2.5 rounded-full border transition-all ${
              isWishlisted
                ? 'bg-[#7B021D] border-[#7B021D] text-[#F5F5DA]'
                : 'border-[#E9E5C8] bg-[#F5F5DA] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#7B021D]'
            }`}
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-[#F5F5DA] text-[#F5F5DA]' : ''}`} />
          </button>

          <Link
            to={`/books/${bookSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-editorial-sans font-semibold uppercase tracking-[0.06em] hover:bg-[#520014] transition-all duration-300 shadow-sm"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   2. MINIMAL BOOK CARD (Catalogue Browsing Tile)
   ========================================================================= */
export function MinimalBookCard({ book, index = 0, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={`group bg-[#FFFDF3] rounded-2xl p-5 border border-[#E9E5C8] hover:border-[#7B021D] transition-all duration-300 shadow-2xs hover:shadow-xl hover:shadow-[#520014]/[0.06] flex flex-col justify-between h-full ${className}`}
    >
      <div>
        <div className="relative mb-4">
          <Link to={`/books/${bookSlug}`} className="block">
            <BookCover book={book} imageClassName="group-hover:scale-105" />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(book.id || book._id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#F5F5DA]/95 backdrop-blur-sm border border-[#E9E5C8] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#7B021D] transition-all"
            title={isWishlisted ? 'Saved in Wishlist' : 'Bookmark Title'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7B021D] text-[#7B021D]' : ''}`} />
          </button>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-[0.14em] text-[#7B021D] font-bold block">
            {book.genre || book.category}
          </span>
          <Link to={`/books/${bookSlug}`}>
            <h3 className="font-editorial-serif text-[19px] font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors line-clamp-2 leading-tight">
              {book.title}
            </h3>
          </Link>
          <Link
            to={`/authors/${authorSlug}`}
            className="text-[12px] font-editorial-sans text-[#6B5E5E] hover:text-[#211D1D] font-medium block truncate"
          >
            By {book.author}
          </Link>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-editorial-sans font-tabular">
        <span className="font-bold text-[15px] text-[#211D1D]">{formatPrice(book.price)}</span>
        <div className="flex items-center gap-1 text-[#6B5E5E]">
          <Star className="w-3 h-3 fill-[#7B021D] text-[#7B021D]" />
          <span className="font-bold text-[#211D1D]">{book.rating || 4.8}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   3. EDITORIAL HORIZONTAL BOOK CARD (Cover Left, Story Right)
   ========================================================================= */
export function EditorialHorizontalBookCard({ book, index = 0, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`bg-[#FFFDF3] rounded-2xl p-5 sm:p-6 border border-[#E9E5C8] hover:border-[#7B021D] transition-all duration-300 group shadow-2xs hover:shadow-lg flex flex-col sm:flex-row gap-5 items-start justify-between ${className}`}
    >
      <Link to={`/books/${bookSlug}`} className="w-full sm:w-32 shrink-0 block">
        <BookCover book={book} variant="horizontal" imageClassName="group-hover:scale-105" />
      </Link>

      <div className="flex-1 flex flex-col justify-between h-full space-y-3 w-full">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-editorial-sans text-[#7B021D] font-bold">
              {book.genre || book.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(book.id || book._id);
              }}
              className="text-[#6B5E5E] hover:text-[#211D1D]"
              title={isWishlisted ? 'Saved in Wishlist' : 'Bookmark Title'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7B021D] text-[#7B021D]' : ''}`} />
            </button>
          </div>

          <Link to={`/books/${bookSlug}`}>
            <h4 className="font-editorial-serif text-[20px] font-semibold text-[#211D1D] leading-tight group-hover:text-[#7B021D] transition-colors mt-1">
              {book.title}
            </h4>
          </Link>

          <Link
            to={`/authors/${authorSlug}`}
            className="text-[13px] font-editorial-sans text-[#6B5E5E] hover:text-[#211D1D] block transition-colors mt-0.5 font-medium"
          >
            By {book.author}
          </Link>

          <p className="text-[12px] text-[#6B5E5E] font-sans line-clamp-2 leading-relaxed pt-1.5 italic">
            "{book.synopsis}"
          </p>
        </div>

        <div className="pt-3 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-editorial-sans font-tabular">
          <span className="text-[16px] font-bold text-[#211D1D]">{formatPrice(book.price)}</span>
          <Link
            to={`/books/${bookSlug}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#211D1D] group-hover:text-[#7B021D] transition-colors"
          >
            <span>Read Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   4. BOOK COVER FLOAT CARD (3D Physical Object)
   ========================================================================= */
export function BookCoverFloatCard({ book, className = '' }) {
  if (!book) return null;
  const bookSlug = book.slug || book.id || book._id;

  return (
    <Link to={`/books/${bookSlug}`} className={`block group select-none ${className}`}>
      <div className="book-card-3d relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-[#E9E5C8] bg-[#FFFDF3]">
        <div className="book-spine-depth" />
        <BookCover book={book} variant="3d" className="w-full h-full" showShadow={false} />
      </div>
    </Link>
  );
}

/* =========================================================================
   5. BOOK SHELF SHOWCASE (Curated Physical Hardcover Series)
   ========================================================================= */
export function BookShelfShowcase({ books = [], className = '' }) {
  const shelfBooks = books.slice(0, 5);

  return (
    <div className={`relative bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E9E5C8]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.18em] text-[#7B021D] font-bold block mb-1">
            Curated Physical Series
          </span>
          <h3 className="font-editorial-serif text-2xl font-semibold text-[#211D1D]">
            The Hardcover Collection
          </h3>
        </div>
        <Link
          to="/books"
          className="text-xs uppercase tracking-wider font-mono text-[#7B021D] hover:underline flex items-center gap-1 font-bold"
        >
          <span>Full Library</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 items-end pt-4 pb-2">
        {shelfBooks.map((b, idx) => {
          const bookSlug = b.slug || b.id || b._id;
          const heights = ['h-56', 'h-64', 'h-72', 'h-60', 'h-68'];
          const spineHeight = heights[idx % heights.length];

          return (
            <Link
              key={bookSlug}
              to={`/books/${bookSlug}`}
              className="group block relative flex flex-col items-center"
            >
              <div
                className={`w-full ${spineHeight} rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 border border-[#E9E5C8] relative bg-[#F5F5DA]`}
              >
                <div className="book-spine-depth" />
                <img
                  src={b.coverImage || b.coverUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-editorial-serif text-sm font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors mt-3 text-center line-clamp-1 w-full">
                {b.title}
              </p>
              <p className="text-[11px] font-editorial-sans text-[#6B5E5E] text-center font-tabular">
                {formatPrice(b.price)}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Physical Wooden/Ivory Base Shelf */}
      <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#E9E5C8] via-[#F5F5DA] to-[#E9E5C8] border-t border-[#E9E5C8] mt-6 shadow-inner" />
    </div>
  );
}

/* =========================================================================
   6. COMPACT CATALOGUE ROW (Dense Horizontal View)
   ========================================================================= */
export function CompactCatalogueRow({ book, index = 0 }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2) }}
      className="group bg-[#FFFDF3] rounded-2xl p-4 sm:p-5 border border-[#E9E5C8] hover:border-[#7B021D] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Link to={`/books/${bookSlug}`} className="w-12 h-16 shrink-0 block rounded-lg overflow-hidden border border-[#E9E5C8] bg-[#F5F5DA]">
          <img src={book.coverImage || book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </Link>
        <div className="min-w-0">
          <span className="text-[9px] uppercase font-mono tracking-[0.14em] text-[#7B021D] font-bold block">
            {book.genre || book.category}
          </span>
          <Link to={`/books/${bookSlug}`}>
            <h4 className="font-editorial-serif text-lg font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors truncate">
              {book.title}
            </h4>
          </Link>
          <Link to={`/authors/${authorSlug}`} className="text-xs font-editorial-sans text-[#6B5E5E] hover:text-[#211D1D] block truncate">
            By {book.author}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E9E5C8]">
        <div className="text-right">
          <span className="font-editorial-sans font-tabular text-base font-bold text-[#211D1D] block">
            {formatPrice(book.price)}
          </span>
          <span className="text-[11px] font-mono text-[#6B5E5E]">
            ★ {book.rating || 4.8}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(book.id || book._id)}
            className={`p-2 rounded-full border transition-all ${
              isWishlisted
                ? 'bg-[#7B021D] border-[#7B021D] text-[#F5F5DA]'
                : 'border-[#E9E5C8] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#7B021D]'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#F5F5DA] text-[#F5F5DA]' : ''}`} />
          </button>
          <Link
            to={`/books/${bookSlug}`}
            className="p-2 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#211D1D] group-hover:bg-[#7B021D] group-hover:text-[#F5F5DA] group-hover:border-[#7B021D] transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   7. AUTHOR FEATURE CARD (Literary Laureate Magazine Feature)
   ========================================================================= */
export function AuthorFeatureCard({ author, className = '' }) {
  if (!author) return null;
  const authorSlug = author.slug || author.id || author.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-sm hover:shadow-xl hover:shadow-[#520014]/[0.08] transition-all duration-400 group flex flex-col justify-between ${className}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9E5C8] shadow-sm"
          />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-[#7B021D] font-bold block mb-1">
              Featured Literary Voice
            </span>
            <Link to={`/authors/${authorSlug}`}>
              <h3 className="font-editorial-serif text-2xl font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                {author.name}
              </h3>
            </Link>
            <span className="text-xs font-editorial-sans text-[#6B5E5E]">{author.role || 'Novelist & Historian'}</span>
          </div>
        </div>

        <p className="text-sm font-sans text-[#6B5E5E] leading-relaxed line-clamp-3 italic">
          "{author.bio || 'Crafting seminal literary works that bridge historical heritage and contemporary human condition.'}"
        </p>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#E9E5C8] text-xs font-editorial-sans">
          <div>
            <span className="text-[#6B5E5E] block text-[11px]">Catalog Works</span>
            <span className="font-bold text-[#211D1D] text-sm">{author.worksCount || 12} Titles</span>
          </div>
          <div>
            <span className="text-[#6B5E5E] block text-[11px]">Followers</span>
            <span className="font-bold text-[#211D1D] text-sm">{author.readersCount || '48.5K'}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 flex items-center justify-between">
        <span className="text-xs font-mono text-[#6B5E5E]">VERIFIED BYLINE</span>
        <Link
          to={`/authors/${authorSlug}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-semibold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-sm"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   8. AUTHOR PORTRAIT TILE (Minimal Portrait Card)
   ========================================================================= */
export function AuthorPortraitTile({ author, index = 0 }) {
  if (!author) return null;
  const authorSlug = author.slug || author.id || author.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-[#FFFDF3] rounded-2xl p-5 border border-[#E9E5C8] hover:border-[#7B021D] transition-all shadow-2xs hover:shadow-md flex items-center gap-4"
    >
      <Link to={`/authors/${authorSlug}`} className="shrink-0">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="w-14 h-14 rounded-full object-cover border border-[#E9E5C8] group-hover:scale-105 transition-transform"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/authors/${authorSlug}`}>
          <h4 className="font-editorial-serif text-lg font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors truncate">
            {author.name}
          </h4>
        </Link>
        <p className="text-xs text-[#6B5E5E] truncate">{author.role || 'Literary Author'}</p>
        <span className="text-[10px] font-mono text-[#7B021D] font-bold block mt-1">
          {author.followersCount || '24k'} Readers
        </span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   9. CATEGORY BLOCK (Taxonomy Volume Tile)
   ========================================================================= */
export function CategoryBlock({ category, index = 0, variant = 'default' }) {
  if (!category) return null;
  const categorySlug = category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';

  if (variant === 'featured') {
    return (
      <Link
        to={`/categories/${categorySlug}`}
        className="group relative bg-[#7B021D] text-[#F5F5DA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E9E5C8] font-bold block">
            VOL. {String(index + 1).padStart(2, '0')} · FEATURED IMPRINT
          </span>
          <h3 className="font-editorial-serif text-2xl sm:text-3xl font-semibold leading-tight text-[#F5F5DA]">
            {category.name}
          </h3>
          <p className="text-xs text-[#FFFDF3]/80 line-clamp-2 leading-relaxed">
            {category.description || 'Masterpieces and authoritative volumes in this literary discipline.'}
          </p>
        </div>
        <div className="pt-6 mt-6 border-t border-[#FFFDF3]/20 flex items-center justify-between text-xs font-mono">
          <span>{category.booksCount || 14} Titles</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories/${categorySlug}`}
      className="group bg-[#FFFDF3] rounded-3xl p-6 border border-[#E9E5C8] hover:border-[#7B021D] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#7B021D] font-bold block">
          VOL. {String(index + 1).padStart(2, '0')}
        </span>
        <h4 className="font-editorial-serif text-xl font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors leading-tight">
          {category.name}
        </h4>
        <p className="text-xs text-[#6B5E5E] line-clamp-2 font-sans">
          {category.description || 'Essential published works and scholarly editions.'}
        </p>
      </div>
      <div className="pt-4 mt-4 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-editorial-sans">
        <span className="text-[#6B5E5E] font-mono text-[11px]">{category.booksCount || 12} Titles</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#211D1D] group-hover:text-[#7B021D] transition-colors" />
      </div>
    </Link>
  );
}

/* =========================================================================
   10. TESTIMONIAL CARD (Literary Perspective)
   ========================================================================= */
export function TestimonialCard({ item, index = 0 }) {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-2xs flex flex-col justify-between"
    >
      <div className="space-y-4">
        <Quote className="w-8 h-8 text-[#7B021D]/30" />
        <p className="font-editorial-serif text-lg text-[#211D1D] leading-relaxed italic">
          "{item.quote || item.text}"
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-[#E9E5C8] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#7B021D] font-bold text-xs flex items-center justify-center font-mono">
          {(item.author || item.name || 'R')[0]}
        </div>
        <div>
          <h5 className="font-editorial-serif text-sm font-semibold text-[#211D1D]">
            {item.author || item.name}
          </h5>
          <span className="text-[11px] font-editorial-sans text-[#6B5E5E]">
            {item.role || 'Literary Critic'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   11. STATISTIC BLOCK (Typographic Credibility Counter)
   ========================================================================= */
export function StatisticBlock({ value, label, subtitle }) {
  return (
    <div className="bg-[#FFFDF3] rounded-2xl p-5 sm:p-6 border border-[#E9E5C8] text-center space-y-1 shadow-2xs">
      <span className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#211D1D] tracking-tight block">
        {value}
      </span>
      <h4 className="font-editorial-sans text-xs uppercase tracking-wider font-semibold text-[#7B021D]">
        {label}
      </h4>
      {subtitle && <p className="text-[11px] text-[#6B5E5E] font-sans">{subtitle}</p>}
    </div>
  );
}
