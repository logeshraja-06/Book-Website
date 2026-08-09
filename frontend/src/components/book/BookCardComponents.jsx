import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Bookmark, ArrowUpRight, BookOpen, Sparkles, Feather } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from './BookCover';

export { BookCover };

/* =========================================================================
   1. BOOK CARD (Catalog & General Grid View)
   ========================================================================= */
export function BookCard({ book, index = 0, className = '' }) {
  const { isBookInWishlist, toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
  const isWishlisted = isBookInWishlist(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
      className={`group block bg-[#FFFDF3] rounded-2xl p-5 sm:p-6 border border-[#E9E5C8] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#181E33]/[0.06] hover:border-[#212842]/60 flex flex-col justify-between h-full ${className}`}
    >
      <div>
        <div className="relative mb-4.5 block">
          <Link to={`/books/${bookSlug}`} className="block w-full">
            <BookCover book={book} imageClassName="group-hover:scale-105" />
          </Link>

          <Link
            to={`/categories/${categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#F5F5DA]/95 backdrop-blur-sm text-[10px] uppercase tracking-[0.14em] font-editorial-sans text-[#212842] font-bold border border-[#E9E5C8] hover:bg-[#212842] hover:text-[#F5F5DA] transition-colors"
          >
            {book.genre || book.category}
          </Link>

          <motion.button
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(book);
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#F5F5DA]/95 backdrop-blur-sm border border-[#E9E5C8] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#212842] transition-all shadow-xs"
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
          </motion.button>
        </div>

        <div className="space-y-1.5">
          <Link to={`/books/${bookSlug}`}>
            <h3 className="font-editorial-serif text-[20px] sm:text-[22px] font-semibold tracking-tight text-[#211D1D] leading-[1.25] line-clamp-2 group-hover:text-[#212842] transition-colors duration-300">
              {book.title}
            </h3>
          </Link>
          <Link
            to={`/authors/${authorSlug}`}
            className="text-[13px] font-editorial-sans text-[#6B5E5E] hover:text-[#211D1D] font-medium block transition-colors truncate"
          >
            By {book.author}
          </Link>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#E9E5C8] flex items-center justify-between">
        <span className="font-editorial-sans font-tabular text-[16px] font-bold tracking-tight text-[#211D1D]">
          {formatPrice(book.price)}
        </span>
        <div className="flex items-center gap-1 text-xs text-[#6B5E5E] font-editorial-sans font-tabular">
          <Star className="w-3.5 h-3.5 text-[#212842] fill-[#212842]" />
          <span className="font-bold text-[#211D1D]">{book.rating || 4.8}</span>
          <span className="text-[#6B5E5E] ml-0.5 font-mono text-[11px]">
            ({book.reviewsCount || '1.2k'})
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   2. FEATURED BOOK CARD (Large Split Editorial Composition)
   ========================================================================= */
export function FeaturedBookCard({ book, className = '' }) {
  const { isBookInWishlist, toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
  const isWishlisted = isBookInWishlist(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-[#181E33]/[0.08] transition-all duration-400 group relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#212842]/[0.04] rounded-bl-full pointer-events-none" />

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E5C8] text-xs">
          <span className="px-3 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#212842] text-[11px] font-editorial-sans font-bold tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#212842]" />
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
              className="text-[11px] uppercase tracking-[0.14em] font-editorial-sans text-[#212842] font-bold hover:underline block"
            >
              {book.genre || book.category}
            </Link>

            <Link to={`/books/${bookSlug}`}>
              <h3 className="font-editorial-serif text-2xl sm:text-[26px] font-semibold tracking-tight text-[#211D1D] leading-[1.2] group-hover:text-[#212842] transition-colors duration-300">
                {book.title}
              </h3>
            </Link>

            <p className="text-[14px] font-editorial-sans text-[#6B5E5E]">
              By{' '}
              <Link
                to={`/authors/${authorSlug}`}
                className="text-[#211D1D] font-semibold hover:text-[#212842] transition-colors"
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
          <motion.button
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(book);
            }}
            className={`p-2.5 rounded-full border transition-all ${
              isWishlisted
                ? 'bg-[#212842] border-[#212842] text-[#F5F5DA]'
                : 'border-[#E9E5C8] bg-[#F5F5DA] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#212842]'
            }`}
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-[#F5F5DA] text-[#F5F5DA]' : ''}`} />
          </motion.button>

          <Link
            to={`/books/${bookSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-editorial-sans font-semibold uppercase tracking-[0.06em] hover:bg-[#181E33] transition-all duration-300 shadow-sm"
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
   3. HORIZONTAL BOOK CARD (Cover Left, Story Right)
   ========================================================================= */
export function HorizontalBookCard({ book, index = 0, className = '' }) {
  const { isBookInWishlist, toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
  const isWishlisted = isBookInWishlist(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.2) }}
      className={`bg-[#FFFDF3] rounded-2xl p-5 sm:p-6 border border-[#E9E5C8] hover:border-[#212842] transition-all duration-300 group shadow-2xs hover:shadow-lg hover:shadow-[#181E33]/[0.06] flex flex-col sm:flex-row gap-5 items-start justify-between ${className}`}
    >
      <Link
        to={`/books/${bookSlug}`}
        className="w-full sm:w-32 block shrink-0"
      >
        <BookCover book={book} variant="horizontal" imageClassName="group-hover:scale-105" />
      </Link>

      <div className="flex-1 flex flex-col justify-between h-full space-y-3 w-full">
        <div>
          <div className="flex items-center justify-between">
            <Link
              to={`/categories/${categorySlug}`}
              className="text-[10px] uppercase tracking-[0.14em] font-editorial-sans text-[#212842] font-bold hover:underline"
            >
              {book.genre || book.category}
            </Link>
            <motion.button
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(book);
              }}
              className="text-[#6B5E5E] hover:text-[#211D1D] p-1 rounded-full hover:bg-[#F5F5DA]"
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
            </motion.button>
          </div>

          <Link to={`/books/${bookSlug}`}>
            <h4 className="font-editorial-serif text-[20px] font-semibold text-[#211D1D] leading-tight group-hover:text-[#212842] transition-colors mt-1">
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
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#211D1D] group-hover:text-[#212842] transition-colors"
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
   4. EDITORIAL BOOK CARD (Minimal Art-Directed Catalogue Tile)
   ========================================================================= */
export function EditorialBookCard({ book, index = 0, className = '' }) {
  return <BookCard book={book} index={index} className={className} />;
}

/* =========================================================================
   5. AUTHOR BOOK CARD (Book for Author's Published Works Shelf)
   ========================================================================= */
export function AuthorBookCard({ book, index = 0 }) {
  const { isBookInWishlist, toggleWishlist } = useData();
  if (!book) return null;
  const bookSlug = book.slug || book.id || book._id;
  const isWishlisted = isBookInWishlist(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-[#FFFDF3] rounded-2xl p-4.5 border border-[#E9E5C8] hover:border-[#212842] transition-all shadow-2xs hover:shadow-md block relative"
    >
      <div className="relative mb-3.5">
        <Link to={`/books/${bookSlug}`} className="block">
          <BookCover book={book} variant="shelf" imageClassName="group-hover:scale-105" />
        </Link>
        <motion.button
          type="button"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(book);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-[#F5F5DA]/95 backdrop-blur-sm border border-[#E9E5C8] text-[#6B5E5E] hover:text-[#211D1D]"
          title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
        </motion.button>
      </div>

      <Link to={`/books/${bookSlug}`}>
        <h4 className="font-editorial-serif text-[17px] font-semibold text-[#211D1D] group-hover:text-[#212842] transition-colors line-clamp-1">
          {book.title}
        </h4>
      </Link>
      <div className="flex items-center justify-between text-xs font-editorial-sans font-tabular mt-2 pt-2 border-t border-[#E9E5C8]">
        <span className="font-bold text-[#211D1D]">{formatPrice(book.price)}</span>
        <span className="text-[#6B5E5E] text-[11px]">{book.publishYear || 2025}</span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   6. RELATED BOOK CARD (Compact Recommendation Card)
   ========================================================================= */
export function RelatedBookCard({ book, index = 0 }) {
  const { isBookInWishlist, toggleWishlist } = useData();
  if (!book) return null;
  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const isWishlisted = isBookInWishlist(book);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group bg-[#FFFDF3] rounded-2xl p-4 border border-[#E9E5C8] hover:border-[#212842] transition-all shadow-2xs hover:shadow-md flex flex-col justify-between relative"
    >
      <div>
        <div className="relative mb-3">
          <Link to={`/books/${bookSlug}`} className="block">
            <BookCover book={book} variant="compact" imageClassName="group-hover:scale-105" />
          </Link>
          <motion.button
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(book);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#F5F5DA]/95 backdrop-blur-sm border border-[#E9E5C8] text-[#6B5E5E]"
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
          </motion.button>
        </div>

        <Link to={`/books/${bookSlug}`}>
          <h4 className="font-editorial-serif text-[16px] font-semibold text-[#211D1D] group-hover:text-[#212842] transition-colors line-clamp-1">
            {book.title}
          </h4>
        </Link>
        <Link to={`/authors/${authorSlug}`} className="text-[12px] font-editorial-sans text-[#6B5E5E] hover:text-[#211D1D] block truncate mt-0.5">
          {book.author}
        </Link>
      </div>
      <div className="pt-2 mt-2 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-editorial-sans font-tabular">
        <span className="font-bold text-[#211D1D]">{formatPrice(book.price)}</span>
        <span className="text-[#212842] font-bold text-[11px]">★ {book.rating || 4.8}</span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   7. BOOK DETAILS HERO (3D Interactive Perspective Presentation)
   ========================================================================= */
export function BookDetailsHero({ book }) {
  if (!book) return null;

  return (
    <div className="book-container flex items-center justify-center p-6 sm:p-10">
      <div className="book-card-3d relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#E9E5C8] bg-[#FFFDF3]">
        <div className="book-spine-depth" />
        <BookCover book={book} variant="3d" className="w-full h-full" showShadow={false} />
      </div>
    </div>
  );
}
