import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit3, Trash2, Eye, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function AuthorBooksView() {
  const { books, deleteBook } = useData();
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
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase());
    
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
      showToast('✓ Book removed from author catalog');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <h1 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            My Published Catalog
          </h1>
          <p className="text-xs font-mono text-[#6E6A67] pt-1">
            Manage your manuscripts, edit metadata, and publish new titles.
          </p>
        </div>

        <Link
          to="/author/upload"
          className="px-5 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#D3968C]" />
          <span>Upload Book</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6A67]" />
          <input
            type="text"
            placeholder="Search by title or genre…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono focus:outline-none focus:border-[#D3968C] transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-[#F4EEEA] p-1 rounded-full border border-[#E7D9D3] self-start sm:self-auto">
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all capitalize ${
                filterStatus === st ? 'bg-[#2B2B2B] text-[#FAF8F6] shadow-sm' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book) => {
          const isDraft = book.status === 'Draft' || book.status === 'In Review';
          const isRejected = book.status === 'Rejected';

          return (
            <motion.div
              key={book.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group relative rounded-2xl bg-[#FAF8F6] border border-[#E7D9D3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover & Badge */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EEEA]">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-semibold shadow-sm ${
                    isDraft
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isDraft ? 'Draft' : 'Published'}
                </span>

                {/* Hover Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Link
                    to={`/books/${book.id}`}
                    className="p-3 rounded-full bg-white text-[#2B2B2B] hover:bg-[#D3968C] hover:text-white transition-colors shadow-md"
                    title="View Public Details Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/author/books/${book.id}/edit`}
                    className="p-3 rounded-full bg-white text-[#2B2B2B] hover:bg-[#D3968C] hover:text-white transition-colors shadow-md"
                    title="Edit Book Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(book.id)}
                    className="p-3 rounded-full bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-md"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Info Footer */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D3968C]">
                  {book.genre}
                </span>
                <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] truncate">
                  {book.title}
                </h3>
                <div className="flex items-center justify-between text-xs font-mono text-[#6E6A67] pt-2 border-t border-[#E7D9D3]">
                  <span>₹{book.price}</span>
                  <span>★ {book.rating}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#FAF8F6] text-[#2B2B2B] p-8 rounded-3xl border border-[#E7D9D3] space-y-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial-serif text-2xl font-bold">Delete Title?</h3>
                <p className="text-xs text-[#6E6A67]">
                  Are you sure you want to remove this book from your author catalog? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-md"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="px-6 py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#2B2B2B] text-[#FAF8F6] text-xs font-mono shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D3968C]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
