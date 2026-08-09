import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit3, Trash2, Eye, BookOpen, CheckCircle2, AlertCircle, RotateCcw, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';

export default function AuthorBooksView() {
  const { books = [], studioBooks = [], deleteBook } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'draft' | 'in_review' | 'rejected'
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Combine studioBooks & books for logged-in author
  const allAuthorBooks = (studioBooks.length > 0 ? studioBooks : books).filter((b) => {
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

  const filteredBooks = allAuthorBooks.filter((book) => {
    const matchesSearch =
      (book.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.genre || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'published') return matchesSearch && book.status === 'Published';
    if (filterStatus === 'approved') return matchesSearch && book.status === 'Approved';
    if (filterStatus === 'in_review') return matchesSearch && (book.status === 'In Review' || book.status === 'Pending Review');
    if (filterStatus === 'rejected') return matchesSearch && book.status === 'Rejected';
    if (filterStatus === 'draft') return matchesSearch && (book.status === 'Draft' || !book.status);
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
    <div className="space-y-8 relative bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#7B021D]" />
            Author Manuscript Studio Catalog
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-[#181616] font-bold">
            My Submissions & Published Works
          </h1>
          <p className="text-xs font-sans text-[#5F594F] pt-0.5">
            Manage your manuscript lifecycle, edit submissions, review publisher notes, and publish new works.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/author/upload"
            className="px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#F5F5DA]" />
            <span>Submit New Manuscript</span>
          </Link>
        </motion.div>
      </div>

      {/* ── 2. SEARCH & FILTER TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5F594F]" />
          <input
            type="text"
            placeholder="Search by title or genre…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#D8CFAE] bg-[#FFFDF3] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#7B021D] transition-colors shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F1EED2] p-1.5 rounded-full border border-[#D8CFAE] self-start sm:self-auto shadow-2xs overflow-x-auto">
          {['all', 'published', 'approved', 'in_review', 'rejected', 'draft'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                filterStatus === st ? 'bg-[#7B021D] text-[#F5F5DA] shadow-xs' : 'text-[#5F594F] hover:text-[#181616]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. BOOK CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book, idx) => {
          const bookId = book.id || book._id;
          const status = book.status || 'Draft';
          const isRejected = status === 'Rejected';
          const isApproved = status === 'Approved';
          const isPublished = status === 'Published';
          const isInReview = status === 'In Review' || status === 'Pending Review';

          return (
            <motion.div
              key={bookId || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] overflow-hidden shadow-md hover:shadow-xl hover:border-[#7B021D] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover & Status Badge */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F8F6E5]">
                <img
                  src={book.coverImage || book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold shadow-xs ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                      : isApproved
                      ? 'bg-blue-100 text-blue-900 border border-blue-400'
                      : isRejected
                      ? 'bg-rose-100 text-rose-900 border border-rose-400'
                      : isInReview
                      ? 'bg-purple-100 text-purple-900 border border-purple-400'
                      : 'bg-[#F1EED2] text-[#181616] border border-[#D8CFAE]'
                  }`}
                >
                  {status}
                </span>

                {/* Hover Quick Actions Overlay */}
                <div className="absolute inset-0 bg-[#181616]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  {isPublished && (
                    <Link
                      to={`/books/${book.slug || bookId}`}
                      className="p-3 rounded-full bg-[#FFFDF3] text-[#181616] hover:bg-[#7B021D] hover:text-[#F5F5DA] transition-colors shadow-md"
                      title="View Public Details Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    to={`/author/books/${bookId}/edit`}
                    className="p-3 rounded-full bg-[#FFFDF3] text-[#181616] hover:bg-[#7B021D] hover:text-[#F5F5DA] transition-colors shadow-md"
                    title="Edit Manuscript Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(bookId)}
                    className="p-3 rounded-full bg-[#FFFDF3] text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-md"
                    title="Delete Manuscript"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Info & Rejection Reason Banner */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B021D] font-bold">
                    {book.genre}
                  </span>
                  <h3 className="font-editorial-serif text-lg font-bold text-[#181616] truncate group-hover:text-[#7B021D] transition-colors">
                    {book.title}
                  </h3>

                  {/* Publisher Rejection Banner */}
                  {isRejected && (book.rejectionReason || book.editorialNotes) && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono space-y-1">
                      <span className="font-bold flex items-center gap-1 text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5" /> Publisher Notes:
                      </span>
                      <p className="text-[11px] leading-tight font-sans italic text-rose-800">
                        "{book.rejectionReason || book.editorialNotes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#DED7BD] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#5F594F]">
                    <span className="font-bold text-[#181616]">{formatPrice(book.price)}</span>
                    <span className="text-[#7B021D] font-bold">{book.isbn || 'BV-978-INTERNAL'}</span>
                  </div>

                  {/* Action Buttons Depending on Status */}
                  {isRejected && (
                    <Link
                      to={`/author/books/${bookId}/edit`}
                      className="w-full py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit & Resubmit</span>
                    </Link>
                  )}

                  {status === 'Draft' && (
                    <Link
                      to={`/author/books/${bookId}/edit`}
                      className="w-full py-2.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-xs font-mono font-bold uppercase tracking-wider text-[#181616] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Submit</span>
                    </Link>
                  )}

                  {isPublished && (
                    <Link
                      to={`/books/${book.slug || bookId}`}
                      className="w-full py-2 rounded-full bg-[#F8F6E5] border border-[#D8CFAE] text-xs font-mono font-bold text-[#181616] hover:text-[#7B021D] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Published Book</span>
                    </Link>
                  )}
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
              className="w-full max-w-md bg-[#F5F5DA] text-[#181616] p-8 rounded-3xl border border-[#D8CFAE] space-y-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial-serif text-2xl font-bold">Delete Title?</h3>
                <p className="text-xs text-[#5F594F] font-sans leading-relaxed">
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
                  className="px-6 py-3 rounded-full border border-[#D8CFAE] text-xs font-mono uppercase tracking-wider text-[#5F594F] hover:bg-[#F1EED2] transition-colors"
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
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#7B021D] text-[#F5F5DA] text-xs font-mono shadow-2xl flex items-center gap-3 border border-[#D8CFAE]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
