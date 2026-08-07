import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';

export default function PublisherBooks() {
  const { books, editorialBooks } = useData();
  const [searchParams] = useSearchParams();
  const authorFilterParam = searchParams.get('author');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Published' | 'Pending' | 'Rejected' | 'Archived'

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  const filtered = catalogSource.filter((b) => {
    if (authorFilterParam && b.authorId !== authorFilterParam) return false;
    
    if (statusFilter === 'Published' && b.status !== 'Published') return false;
    if (statusFilter === 'Pending' && b.status !== 'In Review') return false;
    if (statusFilter === 'Rejected' && b.status !== 'Rejected') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7D9D3] pb-4">
        <div>
          <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
            Platform Books Management
          </h2>
          <p className="text-xs text-[#6E6A67]">{filtered.length} Manuscripts Indexed</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A67]" />
          <input
            type="text"
            placeholder="Search catalog…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E7D9D3] text-xs text-[#2B2B2B] focus:outline-none focus:border-[#D3968C]"
          />
        </div>
      </div>

      {/* Simple Text-Link Filters with Accent Underline */}
      <div className="flex items-center gap-8 border-b border-[#E7D9D3]/60 pb-3 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`relative text-xs font-mono uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${
                isActive ? 'text-[#2B2B2B] font-semibold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="publisherBooksTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Editorial List Layout */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] divide-y divide-[#E7D9D3] shadow-sm">
        {filtered.map((book) => {
          const bookId = book.id || book._id;
          return (
            <div
              key={bookId}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4EEEA]/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-14 rounded overflow-hidden bg-[#F4EEEA] shrink-0 border border-[#E7D9D3]">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">{book.title}</h4>
                  <p className="text-xs text-[#6E6A67]">
                    {book.author} · {book.genre} {book.bookCode ? `· ${book.bookCode}` : ''} · ISBN: {book.isbn || '978-81-000000'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7D9D3]">
                {/* Quiet Status Label */}
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                    book.status === 'Published'
                      ? 'text-[#D3968C]'
                      : book.status === 'In Review'
                      ? 'text-[#6E6A67]'
                      : 'text-[#2B2B2B]'
                  }`}
                >
                  {book.status}
                </span>
                <span className="font-mono text-xs font-semibold text-[#2B2B2B]">{formatPrice(book.price)}</span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/books/${bookId}`}
                    className="p-2 rounded-full hover:bg-[#E7D9D3] text-[#2B2B2B] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="View Public Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/publisher/review/${bookId}`}
                    className="px-3 py-1.5 rounded-full border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] hover:border-[#D3968C]"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
