import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ArrowUpRight, Trash2, Sparkles, BookOpen } from 'lucide-react';
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
      <div className="py-16 text-center text-xs font-mono text-[#6B5E5E]">
        Loading your saved bookmarks & annotations…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Quote className="w-3.5 h-3.5 text-[#7B021D]" />
            Saved Excerpts & Annotations
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            Reading Passages & Notes
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            Bookmarked excerpts and personal reflections from your shelf
          </p>
        </div>
        <span className="text-xs font-mono text-[#7B021D] font-bold bg-[#FFFDF3] px-3.5 py-1.5 rounded-full border border-[#E7D9D3]">
          {bookmarks.length} Passage(s) Saved
        </span>
      </div>

      {/* ── 2. QUOTE CARDS LIST ── */}
      {bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center bg-gradient-to-br from-[#FFFDF3] to-[#FAF8F6] rounded-3xl border border-[#E7D9D3] text-xs font-mono text-[#6B5E5E] shadow-sm space-y-3"
        >
          <BookOpen className="w-8 h-8 text-[#7B021D] mx-auto opacity-60" />
          <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
            No Bookmarks Saved Yet
          </h3>
          <p className="max-w-md mx-auto text-[#6B5E5E] font-sans">
            While reading books on your shelf, click the bookmark icon to capture notable quotes and personal annotations!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6 max-w-4xl">
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
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] rounded-3xl p-8 border border-[#E7D9D3] shadow-md space-y-6 hover:border-[#7B021D] hover:shadow-xl hover:shadow-[#7B021D]/10 transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[#E7D9D3]/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center text-[#7B021D]">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          to={`/books/${bookId}`}
                          className="font-editorial-serif text-base font-bold text-[#2B2B2B] hover:text-[#7B021D] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{bookTitle}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#7B021D]" />
                        </Link>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
                          {bm.pageRef || 'Page Note'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6B5E5E]">
                        {bm.dateSaved || 'Recently'}
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteBookmark(bmId)}
                        className="p-2 rounded-full text-[#6B5E5E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {bm.quote && (
                    <blockquote className="font-editorial-serif text-xl sm:text-2xl text-[#2B2B2B] italic leading-relaxed pl-5 border-l-2 border-[#7B021D]">
                      "{bm.quote}"
                    </blockquote>
                  )}

                  {bm.note && (
                    <div className="p-4 rounded-2xl bg-[#FFFDF3] border border-[#E7D9D3] text-xs text-[#6B5E5E] leading-relaxed shadow-inner">
                      <span className="font-mono uppercase font-bold text-[#7B021D] block mb-1">
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
