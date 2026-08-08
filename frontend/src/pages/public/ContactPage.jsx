import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Author Submission',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D]">
      
      {/* ── Editorial Header ── */}
      <section className="border-b border-[#E9E5C8] bg-[#F5F5DA] pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block mb-2">
            Correspondence & Submissions
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-6xl text-[#211D1D] font-normal tracking-tight max-w-4xl leading-tight">
            Inquiries, Submissions & Editorial Correspondence
          </h1>
          <p className="text-sm text-[#6B5E5E] max-w-xl mt-4 leading-relaxed font-sans">
            Have a manuscript query, rights inquiry, or press question? Reach out directly to our editorial board.
          </p>
        </div>
      </section>

      {/* ── Main Contact Form & Text Colophon Spread ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Form with Underline Inputs */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FFFDF3] rounded-3xl p-10 border border-[#E9E5C8] space-y-4 text-center shadow-2xs"
              >
                <CheckCircle2 className="w-12 h-12 text-[#7B021D] mx-auto" />
                <h3 className="font-editorial-serif text-3xl text-[#211D1D]">Correspondence Received</h3>
                <p className="text-sm text-[#6B5E5E] max-w-md mx-auto leading-relaxed font-sans">
                  Thank you for reaching out. Our editorial team reviews submissions weekly and will reply to <strong className="text-[#211D1D]">{formData.email}</strong> within 3 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-bold uppercase tracking-wider text-[#211D1D] hover:border-[#7B021D] transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Underline Style Input: Name */}
                <div className="relative group">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arundhati Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#7B021D] py-3 text-lg text-[#211D1D] placeholder-[#6B5E5E]/40 focus:outline-none transition-colors duration-300 font-editorial-serif"
                  />
                </div>

                {/* Underline Style Input: Email */}
                <div className="relative group">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arundhati@bookverse.studio"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#7B021D] py-3 text-lg text-[#211D1D] placeholder-[#6B5E5E]/40 focus:outline-none transition-colors duration-300 font-editorial-serif"
                  />
                </div>

                {/* Underline Style Select: Inquiry Type */}
                <div className="relative group">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block mb-2">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#7B021D] py-3 text-lg text-[#211D1D] focus:outline-none transition-colors duration-300 font-editorial-serif cursor-pointer"
                  >
                    <option value="Author Submission">Manuscript & Author Submission</option>
                    <option value="Publisher Partnership">Independent Publisher Inquiry</option>
                    <option value="Press & Media">Rights & Press Inquiries</option>
                    <option value="General Feedback">General Reader Correspondence</option>
                  </select>
                </div>

                {/* Underline Style Textarea: Message */}
                <div className="relative group">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block mb-2">
                    Your Message / Synopsis
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or manuscript details…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#7B021D] py-3 text-lg text-[#211D1D] placeholder-[#6B5E5E]/40 focus:outline-none transition-colors duration-300 font-editorial-serif resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-all duration-300 shadow-md group"
                >
                  <span>Dispatch Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            )}
          </div>

          {/* Right Column: Text Colophon */}
          <div className="lg:col-span-5 space-y-10 lg:pl-8 lg:border-l lg:border-[#E9E5C8]">
            
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold">
                Editorial Colophon
              </span>
              <h3 className="font-editorial-serif text-2xl text-[#211D1D] font-normal">
                Direct Contact & Bureaus
              </h3>
            </div>

            <div className="space-y-8 text-sm text-[#6B5E5E] leading-relaxed font-sans">
              
              {/* Bureau 1 */}
              <div className="space-y-1">
                <h4 className="font-editorial-serif text-base font-bold text-[#211D1D]">
                  Chennai Studio & Library
                </h4>
                <p>14 Poes Garden, Alwarpet</p>
                <p>Chennai, Tamil Nadu 600018</p>
                <p className="font-mono text-xs text-[#211D1D] pt-1 font-bold">chennai@bookverse.studio</p>
              </div>

              {/* Bureau 2 */}
              <div className="space-y-1">
                <h4 className="font-editorial-serif text-base font-bold text-[#211D1D]">
                  Bengaluru Editorial Office
                </h4>
                <p>88 Indiranagar 100ft Road</p>
                <p>Bengaluru, Karnataka 560038</p>
                <p className="font-mono text-xs text-[#211D1D] pt-1 font-bold">bengaluru@bookverse.studio</p>
              </div>

              {/* Rights & Press */}
              <div className="space-y-1 pt-4 border-t border-[#E9E5C8]">
                <h4 className="font-editorial-serif text-base font-bold text-[#211D1D]">
                  Rights & Syndication
                </h4>
                <p>For international translation rights, licensing, and adaptation inquiries:</p>
                <p className="font-mono text-xs text-[#7B021D] font-bold pt-1">rights@bookverse.studio</p>
              </div>

              {/* Review Cadence */}
              <div className="p-5 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] text-xs text-[#6B5E5E] space-y-2 shadow-2xs">
                <span className="font-mono uppercase font-bold text-[#211D1D] block">Submission Policy</span>
                <p>
                  Unsolicited manuscripts are reviewed on a rolling monthly basis. Please allow up to 14 days for initial response from our readers.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── FAQ Accordion Section ── */}
      <section className="border-t border-[#E9E5C8] py-24 bg-[#FFFDF3]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold">
              Platform FAQ & Knowledge Base
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#211D1D] font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#6B5E5E] font-sans">
              Common queries regarding manuscript submission, DRM policies, and editorial review
            </p>
          </div>

          <FaqAccordion />

        </div>
      </section>

    </div>
  );
}

/* ── FAQ Accordion Sub-Component ── */
function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What file formats does BookVerse Studio accept for manuscript submissions?",
      a: "We accept PDF, DOC, DOCX, and EPUB files. Manuscripts are uploaded offline through the Author Portal and assessed by our Editorial Control Center."
    },
    {
      q: "Are digital books published on BookVerse Studio DRM-free?",
      a: "Yes. 100% of titles published through BookVerse Studio are DRM-free. Readers retain perpetual rights to read their acquired books across any personal device."
    },
    {
      q: "How long does the editorial review process take?",
      a: "Typical manuscript evaluation takes between 2 to 5 business days. Status updates (In Review, Published, Request Changes) are displayed live in your Author Dashboard."
    },
    {
      q: "How are cover artwork images handled?",
      a: "Cover images should be uploaded in a standard portrait aspect ratio (~2:3 ratio, min 800×1200 px). Our portal generates realistic 3D book-frame physics previews automatically."
    },
    {
      q: "What is the difference between the Author Portal and Editorial Control Center?",
      a: "The Author Portal is where writers register, upload manuscript files, and track submission progress. The Editorial Control Center is the internal back-office workspace where editors review and catalog approved books."
    },
    {
      q: "Can I update my manuscript after submitting?",
      a: "Authors can update metadata and replace files while a book is in Draft status. Once a book is under active Editorial Review or Published, edits require an editorial change request."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-[#F5F5DA] rounded-2xl border border-[#E9E5C8] overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 font-editorial-serif text-lg font-bold text-[#211D1D] hover:text-[#7B021D] transition-colors"
            >
              <span>{item.q}</span>
              <span className="text-xl font-mono text-[#7B021D]">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="px-6 pb-6 text-xs text-[#6B5E5E] leading-relaxed border-t border-[#E9E5C8]/60 pt-4 font-sans"
              >
                {item.a}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
