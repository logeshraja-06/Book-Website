import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, FileText, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AuthorEditBook() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, updateBook, fetchModuleData } = useData();

  const book = getBookById(id);

  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre: 'Historical Fiction',
    language: 'Tamil',
    price: 499,
    isbn: '',
    coverUrl: '',
    pdfFileName: 'manuscript-sample.pdf',
    pdfFileSize: '4.8 MB',
    manuscriptUrl: null,
    pdfFile: null,
    coverFile: null,
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        synopsis: book.synopsis || '',
        genre: book.genre || 'Historical Fiction',
        language: book.language || 'Tamil',
        price: book.price || 499,
        isbn: book.isbn || '',
        coverUrl: book.coverUrl || book.coverImage || '',
        pdfFileName: book.manuscriptFileName || 'manuscript-sample.pdf',
        pdfFileSize: book.manuscriptFileSize || '4.8 MB',
        manuscriptUrl: book.manuscriptUrl || book.pdfPath || null,
        pdfFile: null,
        coverFile: null,
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
        pdfFileName: file.name,
        pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        manuscriptUrl: fileUrl,
      }));
      showToast(t('author.editBook.toastPdfUpdated'));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, coverUrl: reader.result, coverFile: file }));
      reader.readAsDataURL(file);
      showToast(t('author.editBook.toastCoverUpdated'));
    }
  };

  const handleSave = async (e, submitForReview = false) => {
    if (e) e.preventDefault();
    if (!book) return;

    setIsSubmitting(true);
    const targetId = book.id || book._id;

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('synopsis', formData.synopsis);
      formPayload.append('genre', formData.genre);
      formPayload.append('language', formData.language);
      formPayload.append('price', String(formData.price));
      if (formData.isbn) formPayload.append('isbn', formData.isbn);
      
      if (submitForReview) {
        formPayload.append('status', 'Submitted');
      }

      if (formData.coverFile instanceof File) {
        formPayload.append('coverImage', formData.coverFile);
      } else if (formData.coverUrl) {
        formPayload.append('coverUrl', formData.coverUrl);
      }

      if (formData.pdfFile instanceof File) {
        formPayload.append('manuscriptFile', formData.pdfFile);
      }

      const res = await apiFetch(`/studio/books/${targetId}`, {
        method: 'PUT',
        body: formPayload
      }).catch(() => null);

      if (submitForReview) {
        await apiFetch(`/studio/books/${targetId}/submit`, { method: 'POST' }).catch(() => null);
      }

      await updateBook(targetId, {
        title: formData.title,
        synopsis: formData.synopsis,
        genre: formData.genre,
        language: formData.language,
        price: Number(formData.price),
        isbn: formData.isbn,
        coverUrl: formData.coverUrl,
        manuscriptFileName: formData.pdfFileName,
        manuscriptFileSize: formData.pdfFileSize,
        manuscriptUrl: formData.manuscriptUrl,
        status: submitForReview ? 'Submitted' : (book.status || 'Draft')
      });

      if (fetchModuleData) fetchModuleData();

      showToast(submitForReview ? t('author.editBook.toastResubmitted') : t('author.editBook.toastSaved'));
      setTimeout(() => navigate('/author/books'), 1200);
    } catch (err) {
      showToast(`Saved changes: ${err.message}`);
      setTimeout(() => navigate('/author/books'), 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-editorial-serif text-2xl text-[#181616]">{t('author.editBook.notFoundTitle')}</h2>
        <button
          type="button"
          onClick={() => navigate('/author/books')}
          className="text-xs font-mono text-[#212842] hover:underline font-bold"
        >
          {t('author.editBook.returnToMyBooks')}
        </button>
      </div>
    );
  }

  const isRejected = book.status === 'Rejected' || book.status === 'Needs Revision';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8 relative bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl"
    >
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/author/books')}
            className="text-xs font-mono text-[#5F594F] hover:text-[#212842] transition-colors flex items-center gap-1 mb-2 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#212842]" />
            <span>{t('author.editBook.backToCatalog')}</span>
          </button>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#181616]">
            {isRejected ? t('author.editBook.titleEditResubmit') : t('author.editBook.titleEditDetails')}
          </h1>
          {isRejected && (
            <p className="text-xs text-rose-800 font-mono mt-1 font-bold">
              {t('author.editBook.statusLabel')} {book.status} · {t('author.editBook.resubmitNote')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRejected ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              onClick={(e) => handleSave(e, true)}
              className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#F5F5DA]" />
              <span>{isSubmitting ? t('author.editBook.submitting') : t('author.editBook.resubmitButton')}</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              onClick={(e) => handleSave(e, false)}
              className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F5F5DA]" />
              <span>{isSubmitting ? t('author.editBook.saving') : t('author.editBook.saveChanges')}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Rejection Banner */}
      {isRejected && (book.rejectionReason || book.editorialNotes) && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
          <span className="text-xs font-mono font-bold flex items-center gap-1.5 text-rose-700 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            {t('author.editBook.publisherComments')}
          </span>
          <p className="text-xs font-sans italic text-rose-800 leading-relaxed">
            "{book.rejectionReason || book.editorialNotes}"
          </p>
        </div>
      )}

      {/* ── 2. DOCUMENT-STYLE FORM CONTAINER ── */}
      <form onSubmit={(e) => handleSave(e, false)} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
            {t('author.editBook.bookTitle')}
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#D8CFAE] bg-[#FFFDF3] text-sm text-[#181616] focus:outline-none focus:border-[#212842] font-editorial-serif shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
            {t('author.editBook.synopsis')}
          </label>
          <textarea
            rows={5}
            required
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-[#D8CFAE] bg-[#FFFDF3] text-sm text-[#181616] focus:outline-none focus:border-[#212842] leading-relaxed font-sans shadow-inner resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
              {t('author.editBook.genre')}
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#D8CFAE] bg-[#FFFDF3] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842] shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
              {t('author.editBook.language')}
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#D8CFAE] bg-[#FFFDF3] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842] shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
              {t('author.editBook.price')}
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-[#D8CFAE] bg-[#FFFDF3] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842] shadow-inner"
            />
          </div>
        </div>

        {/* Cover Artwork & PDF replacement section */}
        <div className="pt-6 border-t border-[#DED7BD] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
              {t('author.editBook.coverArtwork')}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden border border-[#D8CFAE] shrink-0 bg-[#F8F6E5] shadow-2xs">
                {formData.coverUrl ? (
                  <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#212842]" />
                  </div>
                )}
              </div>
              <label className="flex-1 p-3 rounded-2xl border border-dashed border-[#D8CFAE] bg-[#F8F6E5] text-center text-xs font-mono text-[#212842] font-bold hover:border-[#212842] cursor-pointer">
                {t('author.editBook.uploadNewCover')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
              {t('author.editBook.manuscriptFile')}
            </label>
            <div className="p-3.5 rounded-2xl border border-[#D8CFAE] bg-[#F8F6E5] flex items-center justify-between text-xs font-mono relative shadow-inner">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#212842]" />
                <span className="truncate max-w-[150px] font-bold text-[#181616]">{formData.pdfFileName}</span>
              </div>
              <label className="text-[11px] text-[#212842] font-bold hover:underline cursor-pointer">
                {t('author.editBook.replacePdf')}
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

        <div className="pt-4 flex items-center justify-between border-t border-[#DED7BD]">
          {isRejected ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              onClick={(e) => handleSave(e, true)}
              className="px-8 py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F5F5DA]" />
              <span>{isSubmitting ? t('author.editBook.submitting') : t('author.editBook.saveAndResubmit')}</span>
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F5F5DA]" />
              <span>{isSubmitting ? t('author.editBook.saving') : t('author.editBook.saveMetadataChanges')}</span>
            </motion.button>
          )}
        </div>
      </form>

      {/* ── 3. TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#212842] text-[#F5F5DA] text-xs font-mono shadow-2xl flex items-center gap-3 border border-[#D8CFAE]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
