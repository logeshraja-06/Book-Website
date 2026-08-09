import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Sparkles, X, ArrowRight } from 'lucide-react';
import { ALL_GENRES, ALL_LANGUAGES } from '../../data/booksData';

export default function QuickDiscoveryBar() {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedSort, setSelectedSort] = useState('relevance');

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (selectedGenre !== 'All') params.set('genre', selectedGenre);
    if (selectedLanguage !== 'All') params.set('language', selectedLanguage);
    if (selectedSort !== 'relevance') params.set('sort', selectedSort);
    navigate(`/books?${params.toString()}`);
  };

  const quickGenres = ['All', 'Historical Fiction', 'Behavioral Economics', 'Philosophy & Mindset', 'Poetry & Classics'];

  return (
    <div className="bg-[#FFFDF3] border-y border-[#E9E5C8] py-6 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] flex items-center justify-center text-[#212842]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#212842] font-bold block">
              Quick Discovery
            </span>
            <span className="font-editorial-serif text-lg font-bold text-[#211D1D]">
              Explore Catalog by Filter
            </span>
          </div>
        </div>

        {/* Quick Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {quickGenres.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGenre(g);
                  const params = new URLSearchParams();
                  if (g !== 'All') params.set('genre', g);
                  navigate(`/books?${params.toString()}`);
                }}
                className={`px-4 py-2 rounded-full text-xs font-editorial-sans font-bold whitespace-nowrap transition-all duration-250 ${
                  isSelected
                    ? 'bg-[#212842] text-[#F5F5DA] shadow-2xs'
                    : 'bg-[#F5F5DA] border border-[#E9E5C8] text-[#211D1D] hover:border-[#212842]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleApplyFilter}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#211D1D] text-[#F5F5DA] text-xs font-editorial-sans font-bold uppercase tracking-wider hover:bg-[#212842] transition-colors"
          >
            <span>Browse Full Index</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5F5DA]" />
          </button>
        </div>

      </div>
    </div>
  );
}
