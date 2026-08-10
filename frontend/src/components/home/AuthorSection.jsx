import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AuthorCard } from '../ui/EditorialCards';
import { useTranslation } from 'react-i18next';

export default function AuthorSection() {
  const { t } = useTranslation();
  const { authors = [] } = useData();

  // Featured laureate author: Kalki Krishnamurthy or first author
  const featuredAuthor =
    authors.find((a) => a.id === 'kalki-krishnamurthy' || a.slug === 'kalki-krishnamurthy') ||
    authors[0];

  // Supporting authors to form a uniform 4-card grid
  const supportingAuthors = authors
    .filter((a) => (a.id || a.slug) !== (featuredAuthor?.id || featuredAuthor?.slug))
    .slice(0, 3);

  const displayAuthors = featuredAuthor ? [featuredAuthor, ...supportingAuthors] : authors.slice(0, 4);

  if (displayAuthors.length === 0) return null;

  return (
    <section id="authors" className="py-24 sm:py-28 lg:py-32 bg-[#F5F5DA] border-y border-[#E9E5C8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16 sm:space-y-20">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-editorial-sans text-[#212842] block mb-2.5 font-bold">
              {t('home.authors.eyebrow')}
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#211D1D] font-normal tracking-tight leading-tight">
              {t('home.authors.title')}
            </h2>
          </div>
          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-[#6B5E5E] leading-relaxed font-sans">
              {t('home.authors.subtitle')}
            </p>
            <Link
              to="/authors"
              className="inline-flex items-center gap-1.5 text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#212842] hover:text-[#181E33] transition-colors"
            >
              <span>{t('home.authors.exploreIndex')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── UNIFORM EQUAL-SIZED AUTHOR CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {displayAuthors.map((author, idx) => (
            <AuthorCard
              key={author.slug || author.id || idx}
              author={author}
              index={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
