import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, Download, ShoppingBag } from 'lucide-react';

export default function SampleReaderModal({ isOpen, onClose, book, onPurchaseClick }) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!book) return null;

  // Exactly 2 Pages of Sample Excerpt
  const samplePages = [
    {
      pageNumber: 1,
      sectionTitle: 'Chapter I: The Solitary Courier',
      content: (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#D3968C] font-semibold">
            Chapter Excerpt · Page 1 of 2
          </p>
          <h2 className="font-editorial-serif text-3xl font-normal leading-tight text-[#2B2B2B]">
            The Messenger at the Gate
          </h2>
          <p className="leading-[1.85] text-[#363432]">
            The dusk fell over the ancient valley of Thanjavur with the slow, deliberate gravity of a silk curtain. High above the stone ramparts, the standard of the realm fluttered against a sky stained in shades of bruised saffron and dark indigo. Below, the river rushed past stone piers that had witnessed three centuries of dynastic triumph and silent betrayals.
          </p>
          <p className="leading-[1.85] text-[#363432]">
            Vanthiyathevan adjusted the leather strap of his sword belt as his mare trotted across the causeway. The evening air was thick with the scent of night-blooming jasmine and woodfire smoke from the outer encampments. Before him loomed the vast outer walls of the fortress, their granite blocks fitted so tightly that not even a blade could slide between them.
          </p>
        </div>
      )
    },
    {
      pageNumber: 2,
      sectionTitle: 'Chapter I: The Solitary Courier (Continued)',
      content: (
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#D3968C] font-semibold">
            Chapter Excerpt · Page 2 of 2
          </p>
          <h2 className="font-editorial-serif text-3xl font-normal leading-tight text-[#2B2B2B]">
            Whispers in the Citadel
          </h2>
          <p className="leading-[1.85] text-[#363432]">
            "Halt who goes there?" shouted the guard from the watchtower, his torch casting long, dancing shadows across the moat.
          </p>
          <p className="leading-[1.85] text-[#363432]">
            "A traveler with tidings from the southern campaign," Vanthiyathevan replied smoothly, leaning forward in his saddle. "Tidings intended for the eyes of the Prime Minister alone."
          </p>
          <p className="leading-[1.85] text-[#363432]">
            The heavy oak gates groaned open on iron hinges. Beyond lay a labyrinth of torchlit courtyards and whispered counsels—the true heart of imperial power.
          </p>

          {/* End of Preview Message & Call to Action */}
          <div className="pt-6 mt-6 border-t border-[#E7D9D3] space-y-4 text-center bg-[#F4EEEA]/50 p-6 rounded-2xl">
            <p className="font-editorial-serif text-base italic text-[#2B2B2B]">
              This is a sample preview. Purchase the full book to continue reading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onPurchaseClick) onPurchaseClick();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-[#D3968C]" />
                <span>Purchase Full Book (₹{book.price.toLocaleString()})</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider hover:bg-current/5 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSample = samplePages[currentPage];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FAF8F6] text-[#2B2B2B] rounded-3xl shadow-2xl border border-[#E7D9D3] flex flex-col overflow-hidden max-h-[85vh]"
          >
            {/* Header */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-[#E7D9D3] bg-[#F4EEEA]/80 shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-11 rounded overflow-hidden shrink-0 border border-[#E7D9D3] shadow-sm">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-editorial-serif text-sm font-bold truncate text-[#2B2B2B]">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-[#6E6A67] font-mono truncate">
                    Sample Preview · By {book.author}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#6E6A67] hover:text-[#2B2B2B]"
                aria-label="Close Sample Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Reading Content */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-10 font-editorial-serif text-lg">
              <AnimatePresence mode="wait">
                <motion.article
                  key={currentPage}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {currentSample.content}
                </motion.article>
              </AnimatePresence>
            </main>

            {/* Footer Navigation */}
            <footer className="h-16 px-6 flex items-center justify-between border-t border-[#E7D9D3] bg-[#F4EEEA]/80 shrink-0 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                className="inline-flex items-center gap-1.5 text-[#2B2B2B] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#D3968C] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Page 1</span>
              </button>

              <span className="text-[#6E6A67] font-semibold">
                Page {currentPage + 1} of 2
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 text-[#2B2B2B] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#D3968C] transition-colors"
              >
                <span>Page 2</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
