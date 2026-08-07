import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AuthorEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, updateBook } = useData();

  const book = getBookById(id);

  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre: 'Historical Fiction',
    language: 'Tamil',
    price: 499,
    coverUrl: '',
    pdfFileName: 'manuscript-sample.pdf',
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        synopsis: book.synopsis || '',
        genre: book.genre || 'Historical Fiction',
        language: book.language || 'Tamil',
        price: book.price || 499,
        coverUrl: book.coverUrl || '',
        pdfFileName: 'manuscript-sample.pdf',
      });
    }
  }, [book]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (book) {
      updateBook(book.id, {
        title: formData.title,
        synopsis: formData.synopsis,
        genre: formData.genre,
        language: formData.language,
        price: Number(formData.price),
        coverUrl: formData.coverUrl,
      });
      showToast('✓ Book metadata updated successfully');
      setTimeout(() => navigate('/author/books'), 1200);
    }
  };

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-editorial-serif text-2xl">Book Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/author/books')}
          className="text-xs font-mono text-[#D3968C] hover:underline"
        >
          Return to My Books
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/author/books')}
            className="text-xs font-mono text-[#6E6A67] hover:text-[#2B2B2B] transition-colors flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Books</span>
          </button>
          <h1 className="font-editorial-serif text-3xl font-normal text-[#2B2B2B]">
            Edit Book Details
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#D3968C]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F6] border border-[#E7D9D3] shadow-lg space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
            Book Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-sm focus:outline-none focus:border-[#D3968C]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
            Synopsis / Description
          </label>
          <textarea
            rows={5}
            required
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-sm focus:outline-none focus:border-[#D3968C] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
              Genre
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
              Language
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono"
            />
          </div>
        </div>

        {/* Cover Artwork & PDF replacement section */}
        <div className="pt-6 border-t border-[#E7D9D3] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
              Cover Image URL
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden border border-[#E7D9D3] shrink-0">
                <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-[#E7D9D3] text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
              Manuscript File (PDF)
            </label>
            <div className="p-3 rounded-xl border border-[#E7D9D3] bg-[#F4EEEA]/50 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D3968C]" />
                <span className="truncate max-w-[150px]">{formData.pdfFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('✓ Replace manuscript file selected')}
                className="text-[11px] text-[#D3968C] font-semibold hover:underline"
              >
                Replace PDF
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#D3968C]" />
            <span>Save Metadata Changes</span>
          </button>
        </div>
      </form>

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
