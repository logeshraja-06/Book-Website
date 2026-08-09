import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { ArrowUpRight } from 'lucide-react';
import { CategoryBlock } from '../ui/EditorialCards';

export default function CategorySection() {
  const { categories = [] } = useData();

  return (
    <section id="categories" className="py-24 sm:py-28 lg:py-32 bg-[#F5F5DA] border-y border-[#E9E5C8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-editorial-sans text-[#212842] block mb-2.5 font-bold">
              Taxonomy & Imprints
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#211D1D] font-normal tracking-tight leading-tight">
              Explore by Category
            </h2>
          </div>
          <div className="space-y-2 max-w-md">
            <p className="text-sm sm:text-base text-[#6B5E5E] leading-relaxed font-sans">
              Discover catalogued volumes classified across classic Tamil literature, behavioral economics, deep work systems, and enduring historical fiction.
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#212842] hover:text-[#181E33] transition-colors"
            >
              <span>View Table of Contents</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── CATEGORY BLOCKS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat, idx) => (
            <CategoryBlock
              key={cat.id || cat._id || idx}
              category={cat}
              index={idx}
              variant={idx === 0 ? 'featured' : 'default'}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
