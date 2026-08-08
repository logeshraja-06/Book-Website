import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, FileText, CheckCircle2, Feather, AlertCircle } from 'lucide-react';
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
    pdfFileSize: '4.8 MB',
    manuscriptUrl: null,
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
        pdfFileName: book.manuscriptFileName || 'manuscript-sample.pdf',
        pdfFileSize: book.manuscriptFileSize || '4.8 MB',
        manuscriptUrl: book.manuscriptUrl || null,
      });
    }
  }, [book]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        pdfFile: file,
        manuscriptFile: file,
        pdfFileName: file.name,
        pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        manuscriptUrl: fileUrl,
      }));
      showToast('✓ Manuscript PDF updated');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (book) {
      await updateBook(book.id || book._id, {
        title: formData.title,
        synopsis: formData.synopsis,
        genre: formData.genre,
        language: formData.language,
        price: Number(formData.price),
        coverUrl: formData.coverUrl,
        manuscriptFileName: formData.pdfFileName,
        manuscriptFileSize: formData.pdfFileSize,
        manuscriptUrl: formData.manuscriptUrl,
        manuscriptFile: formData.manuscriptFile || null,
        coverFile: formData.coverFile || null,
      });
      showToast('Book metadata updated successfully');
      setTimeout(() => navigate('/author/books'), 1200);
    }
  };

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-editorial-serif text-2xl text-[#2B2B2B]">Book Record Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/author/books')}
          className="text-xs font-mono text-[#7B021D] hover:underline font-bold"
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
      className="max-w-3xl mx-auto space-y-8 relative"
    >
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/author/books')}
            className="text-xs font-mono text-[#6B5E5E] hover:text-[#7B021D] transition-colors flex items-center gap-1 mb-2 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#7B021D]" />
            <span>Back to My Books</span>
          </button>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B]">
            Edit Book Details & Metadata
          </h1>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#F5F5DA]" />
          <span>Save Changes</span>
        </motion.button>
      </div>

      {/* ── 2. DOCUMENT-STYLE FORM CONTAINER ── */}
      <form onSubmit={handleSave} className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] shadow-md space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
            Book Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] font-editorial-serif shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
            Synopsis / Description *
          </label>
          <textarea
            rows={5}
            required
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] leading-relaxed font-sans shadow-inner resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Genre
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Language
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] shadow-inner"
            />
          </div>
        </div>

        {/* Cover Artwork & PDF replacement section */}
        <div className="pt-6 border-t border-[#E7D9D3] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Cover Image URL
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden border border-[#E7D9D3] shrink-0 bg-[#F4EEEA] shadow-2xs">
                {formData.coverUrl ? (
                  <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#7B021D]" />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Manuscript File (PDF)
            </label>
            <div className="p-3.5 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] flex items-center justify-between text-xs font-mono relative shadow-inner">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7B021D]" />
                <span className="truncate max-w-[150px] font-bold text-[#2B2B2B]">{formData.pdfFileName}</span>
              </div>
              <label className="text-[11px] text-[#7B021D] font-bold hover:underline cursor-pointer">
                Replace PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#F5F5DA]" />
            <span>Save Metadata Changes</span>
          </motion.button>
        </div>
      </form>

      {/* ── 3. TOAST NOTIFICATION ── */}
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
    </motion.div>
  );
}
