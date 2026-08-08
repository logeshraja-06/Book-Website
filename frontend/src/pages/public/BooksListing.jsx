import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  SlidersHorizontal,
  X,
  BookOpen,
  Search,
  ChevronDown,
  Bookmark,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import { ALL_GENRES, ALL_LANGUAGES } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import { MinimalBookCard, CompactCatalogueRow, BookCoverFloatCard } from '../../components/ui/EditorialCards';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'alpha', label: 'Alphabetical (A-Z)' },
];

export default function BooksListing() {
  const { books: catalogBooks } = useData();
  const publishedBooks = useMemo(
    () => catalogBooks.filter((b) => b.status === 'Published'),
    [catalogBooks]
  );

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'rows' | 'float'

  const filteredBooks = useMemo(() => {
    let books = [...publishedBooks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      books = books.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.genre?.toLowerCase().includes(q) ||
          b.synopsis?.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== 'All') {
      books = books.filter((b) => b.genre === selectedGenre);
    }

    if (selectedLanguage !== 'All') {
      books = books.filter((b) => b.language === selectedLanguage);
    }

    switch (sortBy) {
      case 'price-asc':
        books.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        books.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year-desc':
        books.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
        break;
      case 'year-asc':
        books.sort((a, b) => (a.publishYear || 0) - (b.publishYear || 0));
        break;
      case 'alpha':
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return books;
  }, [publishedBooks, searchQuery, selectedGenre, selectedLanguage, sortBy]);

  const hasActiveFilters =
    selectedGenre !== 'All' || selectedLanguage !== 'All' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSearchQuery('');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      {/* ── 1. EDITORIAL HERO / ARCHIVE INTRO ── */}
      <section className="border-b border-[#E9E5C8] bg-[#F5F5DA] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
              The Complete Archive
            </span>
            <h1 className="font-editorial-serif text-5xl sm:text-6xl text-[#211D1D] font-normal tracking-tight">
              Curated Catalogue
            </h1>
            <p className="text-base text-[#6B5E5E] leading-relaxed font-sans">
              Explore our exhaustive index of historical sagas, behavioral finance treatises, performance psychology manuscripts, and rare Tamil literature.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6B5E5E] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles, authors, genres, or ISBN…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-sm text-[#211D1D] placeholder-[#6B5E5E]/60 focus:outline-none focus:border-[#7B021D] transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER & VIEW CONTROLS TOOLBAR ── */}
      <section className="sticky top-20 z-30 bg-[#F5F5DA]/95 backdrop-blur-md border-b border-[#E9E5C8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Count & Clear */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-editorial-sans text-[#6B5E5E]">
                <span className="font-editorial-serif text-lg font-bold text-[#211D1D] font-tabular">
                  {filteredBooks.length}
                </span>{' '}
                {filteredBooks.length === 1 ? 'volume' : 'volumes'} found
              </span>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#7B021D] hover:text-[#520014] font-bold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>

            {/* Right: Selects & View Mode Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <FilterSelect
                  label="Genre"
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  options={['All', ...ALL_GENRES]}
                />

                <FilterSelect
                  label="Language"
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  options={['All', ...ALL_LANGUAGES]}
                />

                <div className="flex items-center gap-2 text-sm relative">
                  <span className="text-[#6B5E5E] text-xs uppercase tracking-wider font-mono">Sort</span>
                  <div className="relative inline-block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-b border-[#E9E5C8] text-[#211D1D] text-sm py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-[#7B021D] transition-colors font-medium"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#6B5E5E] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center border border-[#E9E5C8] rounded-xl p-1 bg-[#FFFDF3]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#F5F5DA] text-[#7B021D] font-bold'
                      : 'text-[#6B5E5E] hover:text-[#211D1D]'
                  }`}
                  title="Grid Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('rows')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'rows'
                      ? 'bg-[#F5F5DA] text-[#7B021D] font-bold'
                      : 'text-[#6B5E5E] hover:text-[#211D1D]'
                  }`}
                  title="Catalogue Row View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className="md:hidden p-2 rounded-xl border border-[#E9E5C8] text-[#211D1D] flex items-center gap-1.5 text-xs font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B021D]" />
                <span>Filters</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. MOBILE FILTER DRAWER ── */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#F5F5DA] border-b border-[#E9E5C8] px-6 py-5 space-y-4 overflow-hidden"
          >
            <FilterSelect
              label="Genre"
              value={selectedGenre}
              onChange={setSelectedGenre}
              options={['All', ...ALL_GENRES]}
              fullWidth
            />
            <FilterSelect
              label="Language"
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              options={['All', ...ALL_LANGUAGES]}
              fullWidth
            />
            <div className="space-y-1">
              <span className="text-[#6B5E5E] text-xs uppercase tracking-wider font-mono block">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#FFFDF3] border border-[#E9E5C8] rounded-xl p-2.5 text-sm text-[#211D1D] appearance-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6B5E5E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. BOOKS CONTENT DISPLAY (Dynamic View Modes) ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <AnimatePresence mode="wait">
          {filteredBooks.length > 0 ? (
            viewMode === 'rows' ? (
              <motion.div
                key="rows"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#FFFDF3] rounded-3xl p-4 sm:p-6 border border-[#E9E5C8] divide-y divide-[#E9E5C8]/70"
              >
                {filteredBooks.map((book, idx) => (
                  <CompactCatalogueRow
                    key={book.slug || book.id || book._id}
                    book={book}
                    index={idx}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
              >
                {filteredBooks.map((book, idx) => (
                  <MinimalBookCard
                    key={book.slug || book.id || book._id}
                    book={book}
                    index={idx}
                    className="bg-[#FFFDF3] rounded-2xl p-5 border border-[#E9E5C8] shadow-2xs hover:shadow-lg transition-all"
                  />
                ))}
              </motion.div>
            )
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, fullWidth }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${fullWidth ? 'w-full justify-between' : ''}`}>
      <span className="text-[#6E6A67] text-xs uppercase tracking-wider font-mono min-w-fit">
        {label}
      </span>
      <div className="relative inline-block flex-1 sm:flex-initial">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-b border-[#E7D9D3] text-[#2B2B2B] text-sm py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-[#D3968C] transition-colors font-medium w-full"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#6E6A67] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center mb-6">
        <BookOpen className="w-8 h-8 text-[#D3968C]" />
      </div>
      <h3 className="font-editorial-serif text-2xl text-[#2B2B2B] mb-2">
        No titles match your criteria
      </h3>
      <p className="text-sm text-[#6E6A67] max-w-sm mb-6 leading-relaxed font-sans">
        Try broadening your filters or resetting your search to explore other manuscripts in our catalog.
      </p>
      <button
        onClick={onClear}
        className="px-6 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-editorial-sans uppercase tracking-wider font-semibold hover:bg-[#D3968C] transition-colors"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}
