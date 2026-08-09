import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, BookOpen, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';

export default function PublisherBooks() {
  const { books = [], editorialBooks = [] } = useData();
  const [searchParams] = useSearchParams();
  const authorFilterParam = searchParams.get('author');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Published' | 'Pending' | 'Rejected'

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  const filtered = catalogSource.filter((b) => {
    if (authorFilterParam && (b.authorId === authorFilterParam || b.author === authorFilterParam)) return false;
    
    if (statusFilter === 'Published' && b.status !== 'Published') return false;
    if (statusFilter === 'Pending' && b.status !== 'In Review') return false;
    if (statusFilter === 'Rejected' && b.status !== 'Rejected') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.genre || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filterTabs = [
    { label: 'All Catalog Books', value: 'All' },
    { label: 'Published', value: 'Published' },
    { label: 'Pending Review', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  return (
    <div className="space-y-8">
      
      {/* ── 1. HEADER & SEARCH ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#212842]" />
            Catalog Console
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-bold">
            Platform Books Management
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {filtered.length} manuscript(s) indexed in platform catalog
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E5E]" />
          <input
            type="text"
            placeholder="Search catalog titles, authors, genres…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-xs text-[#211D1D] placeholder-[#6B5E5E]/60 focus:outline-none focus:border-[#212842] transition-colors font-mono"
          />
        </div>
      </div>

      {/* ── 2. FILTER TABS WITH SPRING UNDERLINE ── */}
      <div className="flex items-center gap-8 border-b border-[#E9E5C8]/70 pb-3 overflow-x-auto scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`relative text-xs font-mono uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${
                isActive ? 'text-[#211D1D] font-bold' : 'text-[#6B5E5E] hover:text-[#211D1D]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="publisherBooksTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#212842]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 3. EDITORIAL CATALOG LIST ── */}
      <div className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl border border-[#E9E5C8] divide-y divide-[#E9E5C8] shadow-md overflow-hidden">
        {filtered.length > 0 ? (
          filtered.map((book, idx) => {
            const bookId = book.id || book._id;
            return (
              <motion.div
                key={bookId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFFDF3] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-14 rounded overflow-hidden bg-[#F5F5DA] shrink-0 border border-[#E9E5C8] shadow-2xs">
                    <img src={book.coverImage || book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div>
                    <h4 className="font-editorial-serif text-base font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#6B5E5E] font-sans">
                      By {book.author} · {book.genre} {book.bookCode ? `· ${book.bookCode}` : ''} · ISBN: {book.isbn || 'BV-978-INTERNAL'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E9E5C8]">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-0.5 rounded-full border ${
                      book.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : book.status === 'In Review'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {book.status}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#211D1D]">{formatPrice(book.price)}</span>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/books/${book.slug || bookId}`}
                      className="p-2 rounded-full hover:bg-[#F5F5DA] text-[#211D1D] transition-colors"
                      title="View Public Details"
                    >
                      <Eye className="w-4 h-4 text-[#212842]" />
                    </Link>
                    <Link
                      to={`/publisher/review/${bookId}`}
                      className="px-4 py-1.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-xs font-mono font-bold uppercase tracking-wider text-[#211D1D] hover:border-[#212842] hover:text-[#212842] transition-colors shadow-2xs"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 space-y-3">
            <BookOpen className="w-8 h-8 text-[#212842] mx-auto opacity-60" />
            <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
              No Catalog Books Found
            </h3>
            <p className="text-xs text-[#6B5E5E] font-sans">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
