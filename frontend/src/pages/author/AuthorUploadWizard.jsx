import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function AuthorUploadWizard() {
  const navigate = useNavigate();
  const { addBook } = useData();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Historical Fiction',
    language: 'Tamil',
    price: 499,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    pdfFile: null,
    pdfFileName: 'manuscript-sample.pdf',
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
    const newBook = {
      title: formData.title || 'Untitled Manuscript',
      author: currentUser?.name || 'Kalki Krishnamurthy',
      authorId: currentUser?.id || 'kalki-krishnamurthy',
      genre: formData.genre,
      synopsis: formData.description || 'No description provided.',
      price: Number(formData.price) || 499,
      coverUrl: coverPreview,
      coverFile: formData.coverFile || null,
      pdfFile: formData.pdfFile || null,
      manuscriptFile: formData.pdfFile || null,
      status: 'In Review',
      rating: 5.0,
      reviewsCount: 0,
      publishYear: new Date().getFullYear(),
      language: formData.language,
      pages: 320,
      isbn: '978-81-234-' + Math.floor(1000 + Math.random() * 9000),
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
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#E7D9D3] pb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#D3968C] font-semibold">
          3-Step Publishing Wizard
        </span>
        <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#2B2B2B]">
          Upload New Book
        </h1>
        <p className="text-xs font-mono text-[#6E6A67]">
          Publish your new title directly to the BookVerse catalog.
        </p>
      </div>

      {/* ── Thin Step Indicator ── */}
      <div className="flex items-center justify-between px-6 relative">
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-[#E7D9D3] -translate-y-1/2 -z-10" />

        {[1, 2, 3].map((sNum) => {
          const isComplete = step > sNum;
          const isCurrent = step === sNum;

          return (
            <div key={sNum} className="flex flex-col items-center gap-1.5 bg-[#FAF8F6] px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                  isComplete
                    ? 'bg-[#D3968C] text-white shadow-md'
                    : isCurrent
                    ? 'bg-[#2B2B2B] text-[#FAF8F6] ring-4 ring-[#E8C8C2]/40 shadow-sm'
                    : 'bg-[#F4EEEA] text-[#6E6A67] border border-[#E7D9D3]'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : sNum}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E6A67]">
                {sNum === 1 ? 'Details' : sNum === 2 ? 'Uploads' : 'Publish'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Step Form Container ── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F6] border border-[#E7D9D3] shadow-lg">
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
                <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parthiban Kanavu"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-sm focus:outline-none focus:border-[#D3968C]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                  Synopsis / Description *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide an editorial synopsis of the book…"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-sm focus:outline-none focus:border-[#D3968C] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                    Genre / Category
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono focus:outline-none focus:border-[#D3968C]"
                  >
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Literary Realism">Literary Realism</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Poetry & Classics">Poetry & Classics</option>
                    <option value="Memoir & Biography">Memoir & Biography</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono focus:outline-none focus:border-[#D3968C]"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors flex items-center gap-2"
                >
                  <span>Continue to Uploads</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 2: COVER & PDF MANUSCRIPT UPLOADS */}
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
                <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                  Cover Image (2:3 Aspect Ratio)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                    className="sm:col-span-8 p-6 rounded-2xl border-2 border-dashed border-[#E7D9D3] bg-[#F4EEEA]/50 text-center space-y-3 hover:border-[#D3968C] transition-colors cursor-pointer relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageDrop}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 text-[#D3968C] mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#2B2B2B]">Drag & Drop cover artwork here</p>
                      <p className="text-[11px] font-mono text-[#6E6A67]">JPG, PNG or WebP up to 10MB</p>
                    </div>
                  </div>

                  {/* Cover Preview Tile */}
                  <div className="sm:col-span-4 flex justify-center">
                    <div className="w-28 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-[#E7D9D3] bg-white group hover:rotate-1 transition-transform">
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF File Upload */}
              <div className="space-y-3 pt-4 border-t border-[#E7D9D3]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] block font-semibold">
                  PDF Manuscript File
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handlePdfDrop}
                  className="p-6 rounded-2xl border-2 border-dashed border-[#E7D9D3] bg-[#F4EEEA]/50 text-center space-y-3 hover:border-[#D3968C] transition-colors cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-[#D3968C] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#2B2B2B]">Drag & Drop PDF manuscript here</p>
                    <p className="text-[11px] font-mono text-[#6E6A67]">PDF files only</p>
                  </div>

                  {/* Uploaded File Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] shadow-sm">
                    <FileText className="w-4 h-4 text-[#D3968C]" />
                    <span>{formData.pdfFileName}</span>
                    <span className="opacity-50">({formData.pdfFileSize})</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:bg-black/5 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors flex items-center gap-2"
                >
                  <span>Preview & Publish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREVIEW & PUBLISH */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D3968C] font-semibold">
                  Step 3 · Final Verification
                </span>
                <h3 className="font-editorial-serif text-2xl font-normal text-[#2B2B2B]">
                  Catalog Preview
                </h3>
              </div>

              {/* Preview Card */}
              <div className="p-6 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3] flex flex-col sm:flex-row items-start gap-6">
                <div className="w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-[#E7D9D3] shrink-0 mx-auto sm:mx-0">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3 min-w-0 flex-1">
                  <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/40 text-[#2B2B2B] text-[10px] font-mono uppercase tracking-wider font-semibold">
                    {formData.genre}
                  </span>
                  <h4 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                    {formData.title || 'Untitled Manuscript'}
                  </h4>
                  <p className="text-xs font-mono text-[#6E6A67]">
                    By {currentUser?.name || 'Kalki Krishnamurthy'} · {formData.language} Edition
                  </p>
                  <p className="text-xs text-[#2B2B2B] leading-relaxed line-clamp-3">
                    {formData.description || 'No description provided.'}
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#6E6A67]">
                    Attached File: <strong className="text-[#2B2B2B]">{formData.pdfFileName}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:bg-black/5 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-8 py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D3968C]" />
                  <span>Publish Book Now</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
