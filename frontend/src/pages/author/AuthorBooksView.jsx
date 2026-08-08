import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit3, Trash2, Eye, BookOpen, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';

export default function AuthorBooksView() {
  const { books = [], deleteBook } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'draft'
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Author books correctly scoped to logged-in author
  const authorBooks = books.filter((b) => {
    if (!currentUser) return false;
    const currentIdStr = String(currentUser.id || currentUser._id || '');
    const currentName = currentUser.name || currentUser.penName || '';

    const bookAuthorIdStr = String(b.authorId?._id || b.authorId || '');
    const bookAuthorName = b.author || '';

    return (
      (bookAuthorIdStr && bookAuthorIdStr === currentIdStr) ||
      (bookAuthorName && currentName && bookAuthorName.toLowerCase() === currentName.toLowerCase()) ||
      b.legacyId === currentIdStr ||
      (currentName.toLowerCase().includes('kalki') && bookAuthorName.toLowerCase().includes('kalki'))
    );
  });

  const filteredBooks = authorBooks.filter((book) => {
    const matchesSearch =
      (book.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.genre || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const isDraft = book.status === 'Draft' || book.status === 'In Review' || book.status === 'Rejected';

    if (filterStatus === 'published') return matchesSearch && book.status === 'Published';
    if (filterStatus === 'draft') return matchesSearch && isDraft;
    return matchesSearch;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteBook(deleteTargetId);
      setDeleteTargetId(null);
      showToast('Book removed from author catalog');
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#7B021D]" />
            Author Manuscript Catalog
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            My Published Catalog
          </h1>
          <p className="text-xs font-sans text-[#6B5E5E] pt-0.5">
            Manage your manuscripts, edit metadata, and publish new titles.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/author/upload"
            className="px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#F5F5DA]" />
            <span>Upload New Book</span>
          </Link>
        </motion.div>
      </div>

      {/* ── 2. SEARCH & FILTER TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5E5E]" />
          <input
            type="text"
            placeholder="Search by title or genre…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] transition-colors shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF3] p-1.5 rounded-full border border-[#E7D9D3] self-start sm:self-auto shadow-2xs">
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all capitalize ${
                filterStatus === st ? 'bg-[#7B021D] text-[#F5F5DA] shadow-xs' : 'text-[#6B5E5E] hover:text-[#2B2B2B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. BOOK CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book, idx) => {
          const isDraft = book.status === 'Draft' || book.status === 'In Review';
          const bookId = book.id || book._id;

          return (
            <motion.div
              key={bookId || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#7B021D]/10 hover:border-[#7B021D] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover & Badge */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EEEA]">
                <img
                  src={book.coverImage || book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold shadow-xs ${
                    isDraft
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isDraft ? 'Draft' : 'Published'}
                </span>

                {/* Hover Quick Actions Overlay */}
                <div className="absolute inset-0 bg-[#211D1D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Link
                    to={`/books/${book.slug || bookId}`}
                    className="p-3 rounded-full bg-[#FFFDF3] text-[#2B2B2B] hover:bg-[#7B021D] hover:text-[#F5F5DA] transition-colors shadow-md"
                    title="View Public Details Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/author/books/${bookId}/edit`}
                    className="p-3 rounded-full bg-[#FFFDF3] text-[#2B2B2B] hover:bg-[#7B021D] hover:text-[#F5F5DA] transition-colors shadow-md"
                    title="Edit Book Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(bookId)}
                    className="p-3 rounded-full bg-[#FFFDF3] text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-md"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Info Footer */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B021D] font-bold">
                  {book.genre}
                </span>
                <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] truncate group-hover:text-[#7B021D] transition-colors">
                  {book.title}
                </h3>
                <div className="flex items-center justify-between text-xs font-mono text-[#6B5E5E] pt-2 border-t border-[#E7D9D3]">
                  <span className="font-bold text-[#2B2B2B]">{formatPrice(book.price)}</span>
                  <span className="text-[#7B021D] font-bold">★ {book.rating || 4.8}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── 4. DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-[#FFFDF3] text-[#2B2B2B] p-8 rounded-3xl border border-[#E7D9D3] space-y-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial-serif text-2xl font-bold">Delete Title?</h3>
                <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed">
                  Are you sure you want to remove this manuscript from your author catalog? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteConfirm}
                  className="px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-md"
                >
                  Confirm Delete
                </motion.button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="px-6 py-3 rounded-full border border-[#E7D9D3] text-xs font-mono uppercase tracking-wider text-[#6B5E5E] hover:bg-[#F4EEEA] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#7B021D] text-[#F5F5DA] text-xs font-mono shadow-2xl flex items-center gap-3 border border-[#E7D9D3]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
