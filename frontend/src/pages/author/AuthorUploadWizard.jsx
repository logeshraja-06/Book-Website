import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, ChevronRight, ChevronLeft, Check, Sparkles, Feather } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AuthorUploadWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addBook } = useData();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    genre: 'Historical Fiction',
    language: 'Tamil',
    price: 499,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    pdfFile: null,
    pdfFileName: 'manuscript-submission.pdf',
    pdfFileSize: '4.8 MB',
  });

  const [coverPreview, setCoverPreview] = useState(formData.coverUrl);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handlePublish = async () => {
    const segment1 = Math.floor(1000 + Math.random() * 9000);
    const segment2 = Math.floor(1000 + Math.random() * 9000);
    const internalIsbn = `BV-978-${segment1}-${segment2}`;

    const newBook = {
      title: formData.title || 'Untitled Manuscript',
      subtitle: formData.subtitle || '',
      author: currentUser?.name || 'Kalki Krishnamurthy',
      authorId: currentUser?.id || 'kalki-krishnamurthy',
      genre: formData.genre,
      synopsis: formData.description || 'No description provided.',
      price: Number(formData.price) || 499,
      coverUrl: coverPreview,
      coverFile: formData.coverFile || null,
      pdfFile: formData.pdfFile || null,
      manuscriptFile: formData.pdfFile || null,
      status: 'Submitted',
      rating: 5.0,
      reviewsCount: 0,
      publishYear: new Date().getFullYear(),
      language: formData.language,
      pages: 320,
      isbn: internalIsbn,
      manuscriptFileName: formData.pdfFileName,
      manuscriptFileType: 'PDF Document',
      manuscriptFileSize: formData.pdfFileSize,
      manuscriptUrl: formData.manuscriptUrl || null,
    };

    await addBook(newBook);
    navigate('/author/books');
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, coverFile: file }));
    }
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        pdfFile: file,
        pdfFileName: file.name,
        pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        manuscriptUrl: fileUrl,
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* ── 1. HEADER ── */}
      <div className="text-center space-y-2 border-b border-[#E7D9D3] pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center justify-center gap-1.5 mb-1">
          <Feather className="w-3.5 h-3.5 text-[#212842]" />
          {t('author.upload.wizardEyebrow')}
        </span>
        <h1 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B]">
          {t('author.upload.title')}
        </h1>
        <p className="text-xs font-sans text-[#6B5E5E]">
          {t('author.upload.subtitle')}
        </p>
      </div>

      {/* ── 2. STEP INDICATOR ── */}
      <div className="flex items-center justify-between px-6 relative">
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-[#E7D9D3] -translate-y-1/2 -z-10" />

        {[1, 2, 3].map((sNum) => {
          const isComplete = step > sNum;
          const isCurrent = step === sNum;

          return (
            <div key={sNum} className="flex flex-col items-center gap-1.5 bg-[#FAF8F6] px-3">
              <motion.div
                animate={{ scale: isCurrent ? 1.08 : 1 }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isComplete
                    ? 'bg-[#212842] text-[#F5F5DA] shadow-md'
                    : isCurrent
                    ? 'bg-[#2B2B2B] text-[#F5F5DA] ring-4 ring-[#212842]/30 shadow-sm'
                    : 'bg-[#FFFDF3] text-[#6B5E5E] border border-[#E7D9D3]'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4 text-[#F5F5DA]" /> : sNum}
              </motion.div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B5E5E] font-bold">
                {sNum === 1 ? t('author.upload.stepDetails') : sNum === 2 ? t('author.upload.stepUploads') : t('author.upload.stepSubmit')}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 3. STEP FORM CONTAINER ── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] shadow-md">
        <AnimatePresence mode="wait">
          {/* STEP 1: BOOK DETAILS */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNext}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  {t('author.upload.bookTitle')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parthiban Kanavu"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#212842] font-editorial-serif shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  {t('author.upload.synopsis')}
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder={t('author.upload.synopsisPlaceholder')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#212842] leading-relaxed font-sans shadow-inner resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                    {t('author.upload.genre')}
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#212842]"
                  >
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Literary Realism">Literary Realism</option>
                    <option value="Behavioral Economics">Behavioral Economics</option>
                    <option value="Philosophy & Mindset">Philosophy & Mindset</option>
                    <option value="Biographies & Memoirs">Biographies & Memoirs</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                    {t('author.upload.language')}
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#212842]"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                    {t('author.upload.targetPrice')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#212842] shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>{t('author.upload.continueToUploads')}</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* STEP 2: COVER & MANUSCRIPT UPLOADS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Cover Image Upload */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  {t('author.upload.coverLabel')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                    className="sm:col-span-8 p-6 rounded-3xl border-2 border-dashed border-[#E7D9D3] bg-[#FFFDF3] text-center space-y-3 hover:border-[#212842] transition-colors cursor-pointer relative shadow-inner"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageDrop}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 text-[#212842] mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#2B2B2B]">{t('author.upload.coverDragDrop')}</p>
                      <p className="text-[11px] font-mono text-[#6B5E5E]">{t('author.upload.coverFormats')}</p>
                    </div>
                  </div>

                  {/* Cover Preview Tile */}
                  <div className="sm:col-span-4 flex justify-center">
                    <div className="w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-[#E7D9D3] bg-[#FFFDF3] group hover:rotate-1 transition-transform">
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Manuscript File Upload */}
              <div className="space-y-3 pt-4 border-t border-[#E7D9D3]">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  {t('author.upload.manuscriptLabel')}
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handlePdfDrop}
                  className="p-6 rounded-3xl border-2 border-dashed border-[#E7D9D3] bg-[#FFFDF3] text-center space-y-3 hover:border-[#212842] transition-colors cursor-pointer relative shadow-inner"
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword"
                    onChange={handlePdfDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-[#212842] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#2B2B2B]">{t('author.upload.manuscriptDragDrop')}</p>
                    <p className="text-[11px] font-mono text-[#6B5E5E]">{t('author.upload.manuscriptFormats')}</p>
                  </div>

                  {/* Uploaded File Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] shadow-2xs font-bold">
                    <FileText className="w-4 h-4 text-[#212842]" />
                    <span>{formData.pdfFileName}</span>
                    <span className="opacity-50 font-normal">({formData.pdfFileSize})</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-full border border-[#E7D9D3] text-xs font-mono uppercase tracking-wider text-[#6B5E5E] hover:bg-[#F4EEEA] transition-colors flex items-center gap-2 font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('author.upload.back')}</span>
                </button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>{t('author.upload.previewAndReview')}</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREVIEW & SUBMIT */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block">
                  {t('author.upload.reviewStepEyebrow')}
                </span>
                <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                  {t('author.upload.reviewStepTitle')}
                </h3>
              </div>

              {/* Preview Card */}
              <div className="p-6 rounded-3xl bg-[#FFFDF3] border border-[#E7D9D3] flex flex-col sm:flex-row items-start gap-6 shadow-sm">
                <div className="w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-[#E7D9D3] shrink-0 mx-auto sm:mx-0">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#212842] text-[10px] font-mono uppercase tracking-wider font-bold">
                      {formData.genre}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#212842] text-[#F5F5DA] text-[10px] font-mono uppercase tracking-wider font-bold">
                      BV-978-INTERNAL
                    </span>
                  </div>

                  <h4 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                    {formData.title || 'Untitled Manuscript'}
                  </h4>
                  <p className="text-xs font-mono text-[#6B5E5E]">
                    By {currentUser?.name || 'Author'} · {formData.language} Edition · ₹{formData.price}
                  </p>
                  <p className="text-xs text-[#2B2B2B] leading-relaxed line-clamp-3 font-sans">
                    {formData.description || 'No description provided.'}
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#6B5E5E]">
                    {t('author.upload.attachedManuscript')} <strong className="text-[#2B2B2B]">{formData.pdfFileName}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-full border border-[#E7D9D3] text-xs font-mono uppercase tracking-wider text-[#6B5E5E] hover:bg-[#F4EEEA] transition-colors font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('author.upload.back')}</span>
                </button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePublish}
                  className="px-8 py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F5F5DA]" />
                  <span>{t('author.upload.submitForReview')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
