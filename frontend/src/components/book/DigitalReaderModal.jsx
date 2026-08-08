import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Type,
  ZoomIn,
  ZoomOut,
  List,
  Check
} from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';

const FONT_OPTIONS = [
  { name: 'Cormorant Garamond', fontClass: 'font-editorial-serif' },
  { name: 'Lora', fontClass: 'font-serif' },
  { name: 'Libre Baskerville', fontClass: 'font-serif' },
  { name: 'EB Garamond', fontClass: 'font-editorial-serif' },
  { name: 'Fraunces', fontClass: 'font-editorial-serif' }
];

const ZOOM_MODES = [
  { label: 'Comfortable', value: 'comfortable', scale: 1 },
  { label: 'Fit Width', value: 'fit-width', scale: 1.15 },
  { label: 'Fit Height', value: 'fit-height', scale: 0.9 },
  { label: 'Actual Size 100%', value: 'actual', scale: 1 },
  { label: 'Fit to Screen', value: 'fit-screen', scale: 1.05 }
];

const THEMES = {
  cream: { bg: '#F5F5DA', container: '#FFFDF3', text: '#211D1D', border: '#E9E5C8', accent: '#7B021D' },
  sepia: { bg: '#F4EEEA', container: '#FAF8F6', text: '#2B2B2B', border: '#E7D9D3', accent: '#7B021D' },
  dark: { bg: '#141212', container: '#1C1919', text: '#E5E0DC', border: '#332D2D', accent: '#A64A5B' }
};

export default function DigitalReaderModal({ isOpen, onClose, book, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(book?.pages || 350);
  const [fontSize, setFontSize] = useState(18); // Isolated text font size
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0]);
  const [zoomMode, setZoomMode] = useState(ZOOM_MODES[0]);
  const [activeTheme, setActiveTheme] = useState('cream');
  const [tocOpen, setTocOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkSavedToast, setBookmarkSavedToast] = useState('');

  useEffect(() => {
    if (book) {
      setTotalPages(book.pages || 350);
      setCurrentPage(initialPage || 1);
    }
  }, [book, initialPage]);

  // Persist reading position to backend MongoDB on page change
  useEffect(() => {
    if (!book || !isOpen) return;

    const timer = setTimeout(async () => {
      try {
        await apiFetch('/reader/progress', {
          method: 'POST',
          body: JSON.stringify({
            bookId: book._id || book.id,
            currentPage,
            totalPages
          })
        });
      } catch (err) {
        console.warn('Sync reading progress notice:', err.message);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentPage, totalPages, book, isOpen]);

  if (!book) return null;

  const theme = THEMES[activeTheme] || THEMES.cream;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const chapters = [
    { title: 'Chapter 1: Foundations & Beginnings', page: 1 },
    { title: 'Chapter 2: The Architecture of Mindset', page: 24 },
    { title: 'Chapter 3: Strategic Execution', page: 58 },
    { title: 'Chapter 4: Principles of Endurance', page: 92 },
    { title: 'Chapter 5: Epilogue & Final Reflections', page: 140 }
  ];

  const handleBookmarkToggle = async () => {
    try {
      if (!isBookmarked) {
        await apiFetch('/reader/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            bookId: book._id || book.id,
            pageRef: `Page ${currentPage}`,
            quote: `Reading section from ${book.title}`,
            note: 'Saved bookmark'
          })
        });
        setIsBookmarked(true);
        setBookmarkSavedToast(`Bookmark saved for Page ${currentPage}`);
      } else {
        setIsBookmarked(false);
        setBookmarkSavedToast(`Bookmark removed`);
      }
      setTimeout(() => setBookmarkSavedToast(''), 3000);
    } catch (err) {
      console.warn('Bookmark notice:', err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md select-none p-2 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            className="relative w-full max-w-6xl h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Control Bar */}
            <header
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              className="h-16 px-6 flex items-center justify-between border-b shrink-0"
            >
              {/* Left: Book Branding & Table of Contents Button */}
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  style={{ borderColor: theme.border, color: theme.text }}
                  className="p-2 rounded-full border hover:opacity-80 transition-opacity flex items-center gap-1.5 text-xs font-mono"
                  title="Table of Contents"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Contents</span>
                </button>

                <div className="min-w-0 border-l pl-4" style={{ borderColor: theme.border }}>
                  <h3 className="font-editorial-serif text-base font-bold truncate" style={{ color: theme.text }}>
                    {book.title}
                  </h3>
                  <p className="text-[11px] font-mono opacity-60 truncate">
                    {book.author} · {progressPercent}% Read
                  </p>
                </div>
              </div>

              {/* Right Controls: Font, Zoom, Bookmark, Theme, Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Isolated Font Size Controls */}
                <div
                  style={{ borderColor: theme.border }}
                  className="flex items-center gap-1 border rounded-full px-2 py-1 text-xs font-mono"
                >
                  <button
                    onClick={() => setFontSize((f) => Math.max(13, f - 1))}
                    style={{ color: theme.text }}
                    className="p-1 hover:opacity-70 font-bold"
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <span className="px-1 text-[11px] opacity-60">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize((f) => Math.min(28, f + 1))}
                    style={{ color: theme.text }}
                    className="p-1 hover:opacity-70 font-bold"
                    title="Increase font size"
                  >
                    A+
                  </button>
                </div>

                {/* Smart Zoom Selector */}
                <select
                  value={zoomMode.value}
                  onChange={(e) => {
                    const match = ZOOM_MODES.find((z) => z.value === e.target.value);
                    if (match) setZoomMode(match);
                  }}
                  style={{ backgroundColor: theme.container, borderColor: theme.border, color: theme.text }}
                  className="hidden md:block text-xs font-mono rounded-full px-3 py-1.5 border focus:outline-none cursor-pointer"
                >
                  {ZOOM_MODES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>

                {/* Theme Selector */}
                <div className="flex items-center gap-1 border rounded-full p-1" style={{ borderColor: theme.border }}>
                  <button
                    onClick={() => setActiveTheme('cream')}
                    className={`w-5 h-5 rounded-full border ${activeTheme === 'cream' ? 'ring-2 ring-[#7B021D]' : ''}`}
                    style={{ backgroundColor: '#F5F5DA', borderColor: '#E9E5C8' }}
                    title="Ivory Cream Theme"
                  />
                  <button
                    onClick={() => setActiveTheme('sepia')}
                    className={`w-5 h-5 rounded-full border ${activeTheme === 'sepia' ? 'ring-2 ring-[#7B021D]' : ''}`}
                    style={{ backgroundColor: '#F4EEEA', borderColor: '#E7D9D3' }}
                    title="Sepia Theme"
                  />
                  <button
                    onClick={() => setActiveTheme('dark')}
                    className={`w-5 h-5 rounded-full border ${activeTheme === 'dark' ? 'ring-2 ring-[#A64A5B]' : ''}`}
                    style={{ backgroundColor: '#1A1717', borderColor: '#332D2D' }}
                    title="Night Dark Theme"
                  />
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={handleBookmarkToggle}
                  style={{ borderColor: theme.border, color: isBookmarked ? theme.accent : theme.text }}
                  className="p-2 rounded-full border hover:opacity-80 transition-opacity"
                  title="Bookmark Page"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Close Reader */}
                <button
                  onClick={onClose}
                  style={{ borderColor: theme.border, color: theme.text }}
                  className="p-2 rounded-full border hover:opacity-80 transition-opacity"
                  title="Exit Reader"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>
            </header>

            {/* Main Reading Surface Container */}
            <div className="flex-1 relative flex overflow-hidden">
              
              {/* Table of Contents Drawer */}
              <AnimatePresence>
                {tocOpen && (
                  <motion.div
                    initial={{ x: -260, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -260, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ backgroundColor: theme.container, borderColor: theme.border }}
                    className="absolute left-0 top-0 bottom-0 w-72 z-30 border-r p-6 overflow-y-auto space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
                      <h4 className="font-editorial-serif text-base font-bold" style={{ color: theme.text }}>
                        Table of Contents
                      </h4>
                      <button onClick={() => setTocOpen(false)} style={{ color: theme.text }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPage(ch.page);
                            setTocOpen(false);
                          }}
                          style={{
                            backgroundColor: currentPage >= ch.page && (idx === chapters.length - 1 || currentPage < chapters[idx + 1].page) ? theme.bg : 'transparent',
                            color: theme.text
                          }}
                          className="w-full text-left p-3 rounded-xl hover:opacity-80 transition-all flex items-center justify-between border"
                          style={{ borderColor: theme.border }}
                        >
                          <span className="line-clamp-1">{ch.title}</span>
                          <span className="opacity-60 text-[10px]">p. {ch.page}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Centered Large Book Reading Viewport */}
              <main className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div
                  style={{
                    transform: `scale(${zoomMode.scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.3s ease-out'
                  }}
                  className="w-full max-w-3xl min-h-[70vh] my-auto"
                >
                  <motion.article
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      backgroundColor: theme.container,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    className="p-8 sm:p-14 rounded-3xl border shadow-xl space-y-6 leading-[1.85]"
                  >
                    {/* Header Colophon inside Book Page */}
                    <div className="flex items-center justify-between border-b pb-4 text-xs font-mono opacity-50" style={{ borderColor: theme.border }}>
                      <span>{book.title}</span>
                      <span>Page {currentPage} of {totalPages}</span>
                    </div>

                    {/* Dynamic Reading Text Content */}
                    <div className={`${fontFamily.fontClass}`} style={{ fontSize: `${fontSize}px` }}>
                      <h2 className="font-editorial-serif text-3xl font-bold mb-6" style={{ color: theme.accent }}>
                        Chapter {Math.ceil(currentPage / 20)}: The Sanctuary of Craft
                      </h2>

                      <p className="mb-6">
                        Literature exists not as a fleeting commodity of engagement, but as an enduring sanctuary for human contemplation. In the quiet sanctuary of the editorial realm, every sentence is weighed for its rhythmic integrity and emotional resonance.
                      </p>

                      <p className="mb-6">
                        As the courier approached the citadel walls, the lamps along the ramparts burned bright against the deepening dusk. The parchment tucked into his leather tunic carried secrets that could alter the succession of the Chola throne.
                      </p>

                      <p className="mb-6">
                        "Greatness is not inherited by decree," the old scholar had written in the colophon of the great codex. "It is forged in the quiet hours of disciplined study and unyielding commitment to the truth."
                      </p>
                    </div>

                    {/* Footer Page Number inside Book Surface */}
                    <div className="pt-6 border-t flex items-center justify-between text-xs font-mono opacity-50" style={{ borderColor: theme.border }}>
                      <span>BookVerse Studio Publishing House</span>
                      <span>{progressPercent}% Complete</span>
                    </div>

                  </motion.article>
                </div>
              </main>

            </div>

            {/* Bottom Floating Navigation Toolbar */}
            <footer
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              className="h-16 px-6 flex items-center justify-between border-t shrink-0 font-mono text-xs"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ color: theme.text }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Slider / Page Jump Input */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-32 sm:w-48 accent-[#7B021D] cursor-pointer"
                />
                <span style={{ color: theme.text }} className="font-bold">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ color: theme.text }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>

            {/* Toast Notification */}
            <AnimatePresence>
              {bookmarkSavedToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono shadow-2xl flex items-center gap-2 border border-[#E9E5C8]/20 z-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{bookmarkSavedToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
