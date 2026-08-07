import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, SlidersHorizontal, X, BookOpen, Search, ChevronDown } from 'lucide-react';
import { ALL_GENRES, ALL_LANGUAGES } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import SkeletonCard from '../../components/ui/SkeletonCard';

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
  const publishedBooks = useMemo(() => catalogBooks.filter(b => b.status === 'Published'), [catalogBooks]);

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

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
        books.sort((a, b) => (b.publishYear || 2026) - (a.publishYear || 2026));
        break;
      case 'year-asc':
        books.sort((a, b) => (a.publishYear || 2026) - (b.publishYear || 2026));
        break;
      case 'alpha':
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return books;
  }, [selectedGenre, selectedLanguage, sortBy, searchQuery, publishedBooks]);

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSortBy('relevance');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedGenre !== 'All' ||
    selectedLanguage !== 'All' ||
    sortBy !== 'relevance' ||
    searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <section className="border-b border-[#E7D9D3] bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-2">
                Full Catalog
              </span>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] tracking-tight font-normal">
                Browse the Library
              </h1>
              <p className="text-sm text-[#6E6A67] mt-3 max-w-lg leading-relaxed">
                Discover curated manuscripts spanning historical epics, behavioral science, philosophy, and contemporary Indian literature.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A67]" />
              <input
                type="text"
                placeholder="Search titles, authors, genres…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFFFFF] border border-[#E7D9D3] text-sm text-[#2B2B2B] placeholder-[#6E6A67]/60 focus:outline-none focus:border-[#D3968C] transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 bg-[#FAF8F6]/90 backdrop-blur-sm border-b border-[#E7D9D3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-[#6E6A67]">
                <span className="font-editorial-serif text-lg font-semibold text-[#2B2B2B]">
                  {filteredBooks.length}
                </span>{' '}
                {filteredBooks.length === 1 ? 'title' : 'titles'} found
              </span>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#D3968C] hover:text-[#C98579] font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
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
                  <span className="text-[#6E6A67] text-xs uppercase tracking-wider font-mono">Sort</span>
                  <div className="relative inline-block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-b border-[#E7D9D3] text-[#2B2B2B] text-sm py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-[#D3968C] transition-colors font-medium"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#6E6A67] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7D9D3] text-sm text-[#2B2B2B] hover:border-[#D3968C] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFFFFF] border-b border-[#E7D9D3] p-6 space-y-4"
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
              <span className="text-[#6E6A67] text-xs uppercase tracking-wider font-mono block">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#FAF8F6] border border-[#E7D9D3] rounded-xl p-2.5 text-sm text-[#2B2B2B] appearance-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6E6A67] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <AnimatePresence mode="wait">
          {filteredBooks.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredBooks.map((book, idx) => (
                <BookCard key={book.slug || book.id || book._id} book={book} index={idx} />
              ))}
            </motion.div>
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
          className={`bg-transparent border-b border-[#E7D9D3] text-[#2B2B2B] text-sm py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-[#D3968C] transition-colors font-medium w-full`}
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

function BookCard({ book, index }) {
  const bookSlug = book.slug || book.id || book._id;
  const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
    >
      <div className="group block bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#2B2B2B]/[0.06] hover:-translate-y-1.5 hover:border-[#D3968C]/40 flex flex-col justify-between h-full">
        <div>
          <Link to={`/books/${bookSlug}`} className="relative aspect-[3/4] overflow-hidden bg-[#F4EEEA] block">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Link
              to={`/categories/${categorySlug}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#FAF8F6]/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-mono text-[#2B2B2B] font-semibold border border-[#E7D9D3]/50 hover:bg-[#D3968C] hover:text-[#FAF8F6] transition-colors"
            >
              {book.genre}
            </Link>
            {book.editorPick && (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#D3968C] text-[10px] uppercase tracking-wider font-mono text-[#FAF8F6] font-semibold">
                Pick
              </span>
            )}
          </Link>

          <div className="p-5 space-y-2">
            <Link to={`/books/${bookSlug}`}>
              <h3 className="font-editorial-serif text-base font-bold text-[#2B2B2B] leading-snug line-clamp-2 group-hover:text-[#C98579] transition-colors duration-300">
                {book.title}
              </h3>
            </Link>
            <Link
              to={`/authors/${authorSlug}`}
              className="text-xs text-[#6E6A67] hover:text-[#2B2B2B] font-medium block transition-colors"
            >
              By {book.author}
            </Link>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-center justify-between pt-3 border-t border-[#E7D9D3]/50">
            <span className="font-editorial-serif text-lg font-semibold text-[#2B2B2B]">
              {formatPrice(book.price)}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#6E6A67]">
              <Star className="w-3.5 h-3.5 text-[#D3968C] fill-[#D3968C]" />
              <span className="font-medium">{book.rating || 4.8}</span>
              <span className="text-[#6E6A67]/60 ml-0.5">({book.reviewsCount || '1.2k'})</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
      <p className="text-sm text-[#6E6A67] max-w-sm mb-6 leading-relaxed">
        Try adjusting your filters or search query. Our catalog is growing — check back soon for new additions.
      </p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}
