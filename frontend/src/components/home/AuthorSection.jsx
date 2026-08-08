import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AuthorFeatureCard, AuthorPortraitTile } from '../ui/EditorialCards';

export default function AuthorSection() {
  const { authors = [] } = useData();

  // Featured laureate author: Kalki Krishnamurthy or first author
  const featuredAuthor =
    authors.find((a) => a.id === 'kalki-krishnamurthy' || a.slug === 'kalki-krishnamurthy') ||
    authors[0];

  // Supporting 4 authors for portrait tiles
  const supportingAuthors = authors
    .filter((a) => (a.id || a.slug) !== (featuredAuthor?.id || featuredAuthor?.slug))
    .slice(0, 4);

  if (!featuredAuthor) return null;

  return (
    <section id="authors" className="py-24 sm:py-28 lg:py-32 bg-[#F5F5DA] border-y border-[#E9E5C8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-editorial-sans text-[#7B021D] block mb-2.5 font-bold">
              The Literary Guild & Salon
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#211D1D] font-normal tracking-tight leading-tight">
              Meet the Authors
            </h2>
          </div>
          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-[#6B5E5E] leading-relaxed font-sans">
              An illustrious circle of novelists, essayists, researchers, and historians whose works form the intellectual cornerstone of BookVerse Studio.
            </p>
            <Link
              to="/authors"
              className="inline-flex items-center gap-1.5 text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#7B021D] hover:text-[#520014] transition-colors"
            >
              <span>Explore Complete Author Index</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── ASYMMETRIC MAGAZINE LAYOUT: FEATURED LAUREATE + PORTRAIT TILES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Full Feature Card for Laureate */}
          <div className="lg:col-span-6">
            <AuthorFeatureCard author={featuredAuthor} className="h-full" />
          </div>

          {/* Right Column: 2x2 Magazine Portrait Tiles */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {supportingAuthors.map((author, idx) => (
              <AuthorPortraitTile
                key={author.slug || author.id || idx}
                author={author}
                index={idx}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
