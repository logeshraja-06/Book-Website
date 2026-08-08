import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ArrowUpRight, Trash2 } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';

export default function BookmarksView() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await apiFetch('/reader/bookmarks');
      if (res.success && res.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.warn('Fetch bookmarks notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (id) => {
    try {
      await apiFetch(`/reader/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks((prev) => prev.filter((b) => b._id !== id && b.id !== id));
    } catch (err) {
      console.error('Delete bookmark error:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-mono text-[#6B5E5E]">
        Loading your bookmarks & notes…
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E9E5C8] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal">
            Reading Passages & Notes
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1">
            Bookmarked excerpts and personal reflections from your shelf
          </p>
        </div>
        <span className="text-xs font-mono text-[#6B5E5E]">
          {bookmarks.length} Passages Saved
        </span>
      </div>

      {/* Quote-Style Reading Notes Cards */}
      {bookmarks.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDF3] rounded-3xl border border-[#E9E5C8] text-xs font-mono text-[#6B5E5E] shadow-2xs">
          No bookmarks saved yet. While reading books on your shelf, bookmark notable quotes and personal annotations!
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          <AnimatePresence mode="popLayout">
            {bookmarks.map((bm, idx) => {
              const book = bm.bookId || {};
              const bmId = bm._id || bm.id;
              const bookTitle = book.title || bm.bookTitle || 'Book Passage';
              const bookId = book._id || book.id || bm.bookId;

              return (
                <motion.div
                  key={bmId}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-[#FFFDF3] rounded-3xl p-8 border border-[#E9E5C8] shadow-2xs space-y-6 hover:border-[#7B021D] transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[#E9E5C8]/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D]">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          to={`/books/${bookId}`}
                          className="font-editorial-serif text-base font-bold text-[#211D1D] hover:text-[#7B021D] transition-colors inline-flex items-center gap-1.5"
                        >
                          {bookTitle}
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#7B021D]" />
                        </Link>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] block font-bold">
                          {bm.pageRef || 'Page Note'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6B5E5E]">
                        {bm.dateSaved || 'Recently'}
                      </span>
                      <button
                        onClick={() => handleDeleteBookmark(bmId)}
                        className="p-1.5 rounded-full text-[#6B5E5E] hover:text-red-700 hover:bg-[#F5F5DA] transition-colors"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {bm.quote && (
                    <blockquote className="font-editorial-serif text-xl sm:text-2xl text-[#211D1D] italic leading-relaxed pl-4 border-l-2 border-[#7B021D]">
                      "{bm.quote}"
                    </blockquote>
                  )}

                  {bm.note && (
                    <div className="p-4 rounded-2xl bg-[#F5F5DA]/60 border border-[#E9E5C8] text-xs text-[#6B5E5E] leading-relaxed">
                      <span className="font-mono uppercase font-bold text-[#211D1D] block mb-1">
                        Personal Annotation
                      </span>
                      {bm.note}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
