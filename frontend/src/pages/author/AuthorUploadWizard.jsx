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
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#E9E5C8] pb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#7B021D] font-bold">
          Manuscript Submission Wizard
        </span>
        <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#211D1D]">
          Submit Manuscript for Editorial Review
        </h1>
        <p className="text-xs font-mono text-[#6B5E5E]">
          Upload your completed manuscript and cover artwork for publisher evaluation.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between px-6 relative">
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-[#E9E5C8] -translate-y-1/2 -z-10" />

        {[1, 2, 3].map((sNum) => {
          const isComplete = step > sNum;
          const isCurrent = step === sNum;

          return (
            <div key={sNum} className="flex flex-col items-center gap-1.5 bg-[#F5F5DA] px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isComplete
                    ? 'bg-[#7B021D] text-[#F5F5DA] shadow-md'
                    : isCurrent
                    ? 'bg-[#211D1D] text-[#F5F5DA] ring-4 ring-[#7B021D]/30 shadow-sm'
                    : 'bg-[#FFFDF3] text-[#6B5E5E] border border-[#E9E5C8]'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : sNum}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B5E5E] font-bold">
                {sNum === 1 ? 'Details' : sNum === 2 ? 'Uploads' : 'Submit'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Form Container */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#E9E5C8] shadow-lg">
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
                <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parthiban Kanavu"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E9E5C8] bg-[#F5F5DA] text-sm text-[#211D1D] focus:outline-none focus:border-[#7B021D] font-editorial-serif"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                  Synopsis & Editorial Description *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide an editorial synopsis of the book…"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E9E5C8] bg-[#F5F5DA] text-sm text-[#211D1D] focus:outline-none focus:border-[#7B021D] leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E9E5C8] bg-[#F5F5DA] text-xs font-mono text-[#211D1D] focus:outline-none focus:border-[#7B021D]"
                  >
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Literary Realism">Literary Realism</option>
                    <option value="Behavioral Economics">Behavioral Economics</option>
                    <option value="Philosophy & Mindset">Philosophy & Mindset</option>
                    <option value="Biographies & Memoirs">Biographies & Memoirs</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E9E5C8] bg-[#F5F5DA] text-xs font-mono text-[#211D1D] focus:outline-none focus:border-[#7B021D]"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                    Target Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E9E5C8] bg-[#F5F5DA] text-xs font-mono text-[#211D1D] focus:outline-none focus:border-[#7B021D]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors flex items-center gap-2"
                >
                  <span>Continue to Uploads</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
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
                <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                  Book Cover Image (High Resolution Portrait)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                    className="sm:col-span-8 p-6 rounded-2xl border-2 border-dashed border-[#E9E5C8] bg-[#F5F5DA]/50 text-center space-y-3 hover:border-[#7B021D] transition-colors cursor-pointer relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageDrop}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 text-[#7B021D] mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#211D1D]">Drag & Drop cover artwork here</p>
                      <p className="text-[11px] font-mono text-[#6B5E5E]">JPG, PNG or WebP up to 10MB</p>
                    </div>
                  </div>

                  {/* Cover Preview Tile */}
                  <div className="sm:col-span-4 flex justify-center">
                    <div className="w-28 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-[#E9E5C8] bg-[#FFFDF3] group hover:rotate-1 transition-transform">
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Manuscript File Upload */}
              <div className="space-y-3 pt-4 border-t border-[#E9E5C8]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6B5E5E] block font-bold">
                  Manuscript Document (PDF, DOC, DOCX)
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handlePdfDrop}
                  className="p-6 rounded-2xl border-2 border-dashed border-[#E9E5C8] bg-[#F5F5DA]/50 text-center space-y-3 hover:border-[#7B021D] transition-colors cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword"
                    onChange={handlePdfDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-[#7B021D] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#211D1D]">Drag & Drop manuscript document here</p>
                    <p className="text-[11px] font-mono text-[#6B5E5E]">PDF, DOC, DOCX accepted</p>
                  </div>

                  {/* Uploaded File Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono text-[#211D1D] shadow-2xs font-bold">
                    <FileText className="w-4 h-4 text-[#7B021D]" />
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
                  className="px-5 py-3 rounded-full border border-[#E9E5C8] text-xs font-bold uppercase tracking-wider text-[#6B5E5E] hover:bg-[#F5F5DA] transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <span>Preview & Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
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
                <span className="text-xs font-mono uppercase tracking-widest text-[#7B021D] font-bold">
                  Step 3 · Final Verification
                </span>
                <h3 className="font-editorial-serif text-2xl font-normal text-[#211D1D]">
                  Submission Summary & Internal ISBN
                </h3>
              </div>

              {/* Preview Card */}
              <div className="p-6 rounded-3xl bg-[#F5F5DA] border border-[#E9E5C8] flex flex-col sm:flex-row items-start gap-6">
                <div className="w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-[#E9E5C8] shrink-0 mx-auto sm:mx-0">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#7B021D] text-[10px] font-mono uppercase tracking-wider font-bold">
                      {formData.genre}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#7B021D] text-[#F5F5DA] text-[10px] font-mono uppercase tracking-wider font-bold">
                      BV-978-INTERNAL
                    </span>
                  </div>

                  <h4 className="font-editorial-serif text-2xl font-bold text-[#211D1D]">
                    {formData.title || 'Untitled Manuscript'}
                  </h4>
                  <p className="text-xs font-mono text-[#6B5E5E]">
                    By {currentUser?.name || 'Author'} · {formData.language} Edition · ₹{formData.price}
                  </p>
                  <p className="text-xs text-[#211D1D] leading-relaxed line-clamp-3 font-sans">
                    {formData.description || 'No description provided.'}
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#6B5E5E]">
                    Attached Manuscript: <strong className="text-[#211D1D]">{formData.pdfFileName}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 rounded-full border border-[#E9E5C8] text-xs font-bold uppercase tracking-wider text-[#6B5E5E] hover:bg-[#F5F5DA] transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-8 py-3.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F5F5DA]" />
                  <span>Submit Manuscript for Review</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
