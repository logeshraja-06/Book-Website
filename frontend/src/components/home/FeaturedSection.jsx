import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  EditorialHorizontalBookCard,
  MinimalBookCard,
  BookShelfShowcase,
} from '../ui/EditorialCards';

export default function FeaturedSection() {
  const { books = [] } = useData();
  const publishedBooks = books.filter((b) => b.status === 'Published');

  if (publishedBooks.length === 0) return null;

  // Curated selections without large "Editor's Spotlight" card
  const topHorizontalBook = publishedBooks[0];
  const gridBooks = publishedBooks.slice(1, 5);

  return (
    <section id="featured" className="py-20 sm:py-24 lg:py-28 bg-[#F5F5DA] border-y border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* ── 1. SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E9E5C8]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-editorial-sans text-[#212842] block mb-2 font-bold">
              Curated Selections
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1D] font-normal tracking-tight leading-tight">
              Featured Catalogue
            </h2>
          </div>
          <div className="space-y-2 max-w-md">
            <p className="text-xs sm:text-sm text-[#6B5E5E] leading-relaxed font-sans">
              Hand-curated manuscripts and seminal titles chosen by our editorial board for their intellectual rigor, narrative craft, and cultural resonance.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#212842] hover:text-[#181E33] transition-colors"
            >
              <span>Browse Full Index</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── 2. BALANCED EDITORIAL COMPOSITION ── */}
        <div className="space-y-8">
          {/* Top Horizontal Highlight Card */}
          {topHorizontalBook && (
            <EditorialHorizontalBookCard book={topHorizontalBook} index={0} className="w-full" />
          )}

          {/* 4-Column Grid of Minimal Book Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gridBooks.map((b, idx) => (
              <MinimalBookCard
                key={b.slug || b.id || b._id}
                book={b}
                index={idx + 1}
              />
            ))}
          </div>
        </div>

        {/* ── 3. CURATED PHYSICAL READING SHELF ── */}
        <BookShelfShowcase
          books={publishedBooks.slice(0, 5)}
          title="Editorial Hardcover Shelf"
        />

      </div>
    </section>
  );
}
