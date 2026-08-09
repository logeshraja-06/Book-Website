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
  ChevronRight,
  UserCheck,
  Calendar,
  Clock,
  MessageSquare,
  Award
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from '../book/BookCover';

/* =========================================================================
   1. FEATURED BOOK CARD (Asymmetric Split Magazine Feature)
   ========================================================================= */
export function FeaturedBookCard({ book, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || b._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] flex flex-col justify-between shadow-2xs hover:shadow-xl transition-all duration-400 group relative overflow-hidden ${className}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E5C8] text-xs">
          <span className="px-3.5 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#212842] text-[11px] font-editorial-sans font-bold tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
            Editor's Spotlight
          </span>
          <span className="font-mono text-[11px] text-[#6B5E5E] tracking-wider font-bold">
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
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5F5DA] border border-[#E9E5C8] font-bold">
                Hardcover Edition
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5F5DA] border border-[#E9E5C8]">
                {book.pages || 350} Pages
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E9E5C8] flex items-center justify-between mt-6">
        <div>
          <span className="text-[11px] text-[#6B5E5E] font-editorial-sans block">Hardcover Price</span>
          <span className="font-editorial-sans font-tabular text-2xl font-bold tracking-tight text-[#211D1D]">
            {formatPrice(book.price)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleWishlist(book.id || book._id)}
            className="p-2.5 rounded-full border border-[#E9E5C8] text-[#211D1D] hover:border-[#212842] hover:text-[#212842] transition-colors"
            title="Bookmark to Wishlist"
          >
            <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
          </button>
          <Link
            to={`/books/${bookSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-editorial-sans font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors duration-300 shadow-xs"
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
   2. BOOK CATALOG CARD (Medium Portrait Original Cover with Compact Meta)
   ========================================================================= */
export function BookCatalogCard({ book, index = 0, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col justify-between h-full group select-none ${className}`}
    >
      <div>
        <div className="book-container relative mb-4">
          <div className="book-card-3d relative rounded-r-2xl rounded-l-xs overflow-hidden shadow-md group-hover:shadow-2xl transition-shadow duration-400">
            <Link to={`/books/${bookSlug}`} className="block relative aspect-[3/4] overflow-hidden">
              <BookCover book={book} variant="3d" imageClassName="group-hover:scale-[1.02] transition-transform duration-400 ease-out" />
            </Link>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(book.id || book._id);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#FFFDF3]/95 backdrop-blur-md border border-[#E9E5C8] text-[#211D1D] hover:text-[#212842] transition-colors shadow-sm"
            title="Bookmark Title"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
          </button>
        </div>

        <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold block mb-1">
          {book.genre || book.category || 'Literature'}
        </span>

        <Link to={`/books/${bookSlug}`}>
          <h3 className="font-editorial-serif text-lg sm:text-xl font-bold text-[#211D1D] leading-snug line-clamp-1 group-hover:text-[#212842] transition-colors">
            {book.title}
          </h3>
        </Link>

        <p className="text-xs text-[#6B5E5E] font-sans mt-0.5 truncate">
          By {book.author}
        </p>
      </div>

      <div className="pt-2 mt-3 border-t border-[#E9E5C8]/60 flex items-center justify-between font-mono text-xs">
        <span className="font-bold text-[#211D1D] font-editorial-sans text-[15px]">
          {formatPrice(book.price)}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#212842] font-editorial-sans font-bold text-[11px] shadow-2xs">
          <Star className="w-3 h-3 fill-[#212842]" />
          <span>{book.rating || 4.8}</span>
        </span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   3. HORIZONTAL BOOK CARD (Wide Composition, Cover Left, Details Right)
   ========================================================================= */
export function HorizontalBookCard({ book, index = 0, className = '' }) {
  const { wishlistBooks = [], toggleWishlist } = useData();
  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 border border-[#E9E5C8] hover:border-[#212842] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group ${className}`}
    >
      <Link to={`/books/${bookSlug}`} className="w-full sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F5DA] shrink-0 border border-[#E9E5C8]">
        <img
          src={book.coverImage || book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="flex-1 space-y-3 w-full flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#212842] font-bold">
              {book.genre}
            </span>
            <button
              type="button"
              onClick={() => toggleWishlist(book.id || book._id)}
              className="p-1.5 rounded-full text-[#6B5E5E] hover:text-[#212842] transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
            </button>
          </div>

          <Link to={`/books/${bookSlug}`}>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#211D1D] mt-1 group-hover:text-[#212842] transition-colors leading-snug">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-[#6B5E5E] font-sans mt-1">By {book.author}</p>
          <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed line-clamp-2 mt-2">
            {book.synopsis}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E9E5C8] flex items-center justify-between">
          <span className="font-editorial-sans font-tabular text-lg font-bold text-[#211D1D]">
            {formatPrice(book.price)}
          </span>
          <Link
            to={`/books/${bookSlug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-editorial-sans font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors"
          >
            <span>Read Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   4. EDITORIAL FEATURE CARD (Typography-Led Magazine Composition)
   ========================================================================= */
export function EditorialFeatureCard({ book, className = '' }) {
  if (!book) return null;
  const bookSlug = book.slug || book.id || book._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#F5F5DA] rounded-3xl p-8 sm:p-12 border border-[#E9E5C8] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${className}`}
    >
      <div className="lg:col-span-7 space-y-6">
        <span className="px-3.5 py-1.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#212842] text-xs font-mono uppercase tracking-widest font-bold inline-block">
          Featured Magazine Selection
        </span>
        <h2 className="font-editorial-serif text-4xl sm:text-5xl font-normal text-[#211D1D] leading-tight">
          {book.title}
        </h2>
        <p className="text-base text-[#6B5E5E] font-sans leading-relaxed">
          {book.synopsis}
        </p>
        <div className="pt-2 flex items-center gap-4">
          <Link
            to={`/books/${bookSlug}`}
            className="px-8 py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md"
          >
            Explore Feature
          </Link>
        </div>
      </div>

      <div className="lg:col-span-5 flex justify-center">
        <div className="w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#E9E5C8] bg-[#FFFDF3]">
          <img src={book.coverImage || book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   5. AUTHOR CARD (Large Portrait with Integrated Typography)
   ========================================================================= */
export function AuthorCard({ author, index = 0, className = '' }) {
  if (!author) return null;
  const authorSlug = author.slug || author.id || author._id || 'kalki-krishnamurthy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8] shadow-sm hover:shadow-lg hover:border-[#212842]/50 transition-all duration-350 ${className}`}
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-[#F5F5DA] w-full shrink-0">
        <img
          src={author.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
          alt={author.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out filter grayscale-[10%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/90 via-[#211D1D]/25 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

        <div className="absolute bottom-5 left-5 right-5 text-[#F5F5DA] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E9E5C8] font-bold block">
            {author.role || author.genre || 'Laureate Author'}
          </span>
          <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">
            {author.name}
          </h3>
          <p className="text-xs text-[#E9E5C8]/80 font-sans line-clamp-2 pt-0.5 font-normal">
            {author.bio}
          </p>
          <div className="pt-2">
            <Link
              to={`/authors/${authorSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5DA] hover:text-[#FFFDF3] transition-colors"
            >
              <span>View Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   6. CATEGORY CARD (Dynamic Tile with Cover Art & Hover CTA)
   ========================================================================= */
export function CategoryCard({ category, index = 0, className = '' }) {
  if (!category) return null;
  const categorySlug = category.id || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 border border-[#E9E5C8] hover:border-[#212842] shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between h-full ${className}`}
    >
      <div>
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#F5F5DA] border border-[#E9E5C8] mb-4">
          <img
            src={category.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold block mb-1">
          {category.count || 12}+ Archived Works
        </span>
        <h3 className="font-editorial-serif text-2xl font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed line-clamp-2 mt-1">
          {category.desc || `Curated manuscripts and seminal publications in ${category.name}.`}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-[#E9E5C8] flex items-center justify-between">
        <Link
          to={`/categories/${categorySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#212842] hover:underline"
        >
          <span>Explore Category</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   7. STATS / INFORMATION CARD (Minimal Typography & Dividers)
   ========================================================================= */
export function StatsInfoCard({ title, value, subtitle, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="space-y-1.5 p-6 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8]"
    >
      <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block">
        {title}
      </span>
      <p className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-[#6B5E5E] font-sans">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* =========================================================================
   8. FEATURED AUTHOR SPOTLIGHT CARD (Asymmetric Split Banner)
   ========================================================================= */
export function FeaturedAuthorSpotlightCard({ author, className = '' }) {
  if (!author) return null;
  const authorSlug = author.slug || author.id || 'kalki-krishnamurthy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#FFFDF3] rounded-3xl p-8 sm:p-10 lg:p-12 border border-[#E9E5C8] shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center group ${className}`}
    >
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#E9E5C8] relative bg-[#F5F5DA]">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale-[10%] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/75 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#212842] text-[11px] font-editorial-sans uppercase tracking-[0.16em] font-bold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
            Laureate Author Spotlight
          </span>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#211D1D] leading-tight">
            {author.name}
          </h2>
          <p className="text-xs font-editorial-sans text-[#212842] uppercase tracking-widest font-bold">
            {author.role || 'Master Storyteller'}
          </p>
        </div>

        <p className="text-sm sm:text-base text-[#6B5E5E] font-sans leading-relaxed">
          {author.bio}
        </p>

        <div className="pt-2 flex items-center gap-4">
          <Link
            to={`/authors/${authorSlug}`}
            className="px-8 py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-editorial-sans font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md inline-flex items-center gap-2 group/btn"
          >
            <span>Meet Author Shelf</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   9. READER COMMUNITY CARD (Reading Stats & Recommendation Pill)
   ========================================================================= */
export function ReaderCommunityCard({ title, userCount, quote, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#F5F5DA] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] space-y-4 shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#212842]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold block">
            Reader Community
          </span>
          <h4 className="font-editorial-serif text-lg font-bold text-[#211D1D]">
            {title || 'Active BookVerse Club'}
          </h4>
        </div>
      </div>

      <p className="text-xs text-[#6B5E5E] font-sans italic leading-relaxed">
        "{quote || 'BookVerse Studio restores the tranquil pleasure of deep reading.'}"
      </p>

      <div className="pt-2 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-mono text-[#6B5E5E]">
        <span>{userCount || '12,400'} Active Readers</span>
        <span className="text-[#212842] font-bold">DRM-Free Library</span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   10. BLOG EDITORIAL CARD (Magazine Style Article Tile)
   ========================================================================= */
export function BlogEditorialCard({ article, index = 0, className = '' }) {
  if (!article) return null;
  const articleSlug = article.id || article.slug || 'editorial-article';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={`bg-[#FFFDF3] rounded-3xl p-6 border border-[#E9E5C8] hover:border-[#212842] shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#F5F5DA] border border-[#E9E5C8] mb-4">
          <img
            src={article.coverUrl || article.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#6B5E5E] mb-2">
          <span className="text-[#212842] font-bold uppercase tracking-wider">{article.category || 'Editorial'}</span>
          <span>·</span>
          <span>{article.date || 'Aug 2025'}</span>
          <span>·</span>
          <span>{article.readTime || '5 min read'}</span>
        </div>

        <Link to={`/blog/${articleSlug}`}>
          <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors leading-snug">
            {article.title}
          </h3>
        </Link>

        <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed line-clamp-3 mt-2">
          {article.excerpt || article.summary}
        </p>
      </div>

      <div className="pt-4 mt-6 border-t border-[#E9E5C8] flex items-center justify-between">
        <Link
          to={`/blog/${articleSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#212842] hover:underline"
        >
          <span>Read Essay</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

/* =========================================================================
   COMPATIBILITY ALIAS EXPORTS (Ensures existing imports continue working)
   ========================================================================= */
export const MinimalBookCard = BookCatalogCard;
export const EditorialHorizontalBookCard = HorizontalBookCard;
export const BookCoverFloatCard = FeaturedBookCard;
export const CompactCatalogueRow = HorizontalBookCard;
export const AuthorFeatureCard = FeaturedAuthorSpotlightCard;
export const AuthorPortraitTile = AuthorCard;
export const CategoryBlock = CategoryCard;

export function BookShelfShowcase({ books = [], title = "Editorial Shelf" }) {
  if (!books || books.length === 0) return null;
  return (
    <div className="bg-[#FFFDF3] rounded-3xl p-8 border border-[#E9E5C8] space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-4">
        <h3 className="font-editorial-serif text-2xl font-bold text-[#211D1D]">{title}</h3>
        <span className="text-xs font-mono text-[#212842] font-bold">{books.length} Volume Collections</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.slice(0, 5).map((book, idx) => (
          <BookCatalogCard key={`${book.id || book._id || 'cat'}-${idx}`} book={book} index={idx} />
        ))}
      </div>
    </div>
  );
}
