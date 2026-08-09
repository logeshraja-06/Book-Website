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
  Check,
  Download
} from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';
import { getSamplePagesForBook } from '../../data/sampleReadingContent';

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
  const [fontSize, setFontSize] = useState(18); // Isolated text font size
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0]);
  const [zoomMode, setZoomMode] = useState(ZOOM_MODES[0]);
  const [activeTheme, setActiveTheme] = useState('cream');
  const [tocOpen, setTocOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState('toc'); // 'toc' | 'bookmarks'
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarkedList, setBookmarkedList] = useState([]);
  const [bookmarkSavedToast, setBookmarkSavedToast] = useState('');

  const sampleBookData = getSamplePagesForBook(book || {});
  const totalPages = sampleBookData.totalPages || 20;
  const samplePageObj = sampleBookData.pages.find((p) => p.pageNumber === currentPage) || sampleBookData.pages[0];
  const chapters = sampleBookData.chapters;

  const isBookmarked = bookmarkedList.some((bm) => Number(bm.pageNumber) === Number(currentPage));

  useEffect(() => {
    if (!book || !isOpen) return;

    let isMounted = true;
    const targetBookId = book._id || book.id;

    async function loadInitialData() {
      try {
        const [progRes, bmRes] = await Promise.allSettled([
          apiFetch(`/reader/progress/${targetBookId}`),
          apiFetch(`/reader/books/${targetBookId}/bookmarks`)
        ]);

        if (isMounted && progRes.status === 'fulfilled' && progRes.value?.success && progRes.value.data?.currentPage) {
          setCurrentPage(progRes.value.data.currentPage);
        } else if (isMounted && initialPage) {
          setCurrentPage(initialPage);
        }

        if (isMounted && bmRes.status === 'fulfilled' && bmRes.value?.success && Array.isArray(bmRes.value.data)) {
          setBookmarkedList(bmRes.value.data);
        }
      } catch (err) {
        if (isMounted && initialPage) {
          setCurrentPage(initialPage);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [book, isOpen, initialPage]);

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

  const handleBookmarkToggle = async () => {
    if (!book) return;
    const targetBookId = book._id || book.id;

    try {
      if (isBookmarked) {
        await apiFetch(`/reader/books/${targetBookId}/bookmarks/${currentPage}`, {
          method: 'DELETE'
        });
        setBookmarkedList((prev) => prev.filter((bm) => Number(bm.pageNumber) !== Number(currentPage)));
        setBookmarkSavedToast(`Bookmark removed for Page ${currentPage}`);
      } else {
        const res = await apiFetch(`/reader/books/${targetBookId}/bookmarks`, {
          method: 'POST',
          body: JSON.stringify({
            pageNumber: currentPage,
            chapterTitle: samplePageObj?.chapterTitle || `Page ${currentPage}`,
            pageRef: `Page ${currentPage}`
          })
        });
        if (res?.success && res.data) {
          setBookmarkedList((prev) => [...prev.filter((bm) => Number(bm.pageNumber) !== Number(currentPage)), res.data]);
        } else {
          setBookmarkedList((prev) => [...prev.filter((bm) => Number(bm.pageNumber) !== Number(currentPage)), { pageNumber: currentPage, chapterTitle: samplePageObj?.chapterTitle }]);
        }
        setBookmarkSavedToast(`Bookmark saved for Page ${currentPage}`);
      }
      setTimeout(() => setBookmarkSavedToast(''), 3000);
    } catch (err) {
      console.warn('Bookmark notice:', err.message);
      setBookmarkSavedToast('Bookmark error: ' + err.message);
      setTimeout(() => setBookmarkSavedToast(''), 3000);
    }
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async (targetBook) => {
    if (!targetBook) return;
    const bookId = targetBook._id || targetBook.id || targetBook.slug;
    const token = localStorage.getItem('token') || '';
    setIsDownloadingPdf(true);
    setBookmarkSavedToast('Preparing PDF download...');

    try {
      const res = await fetch(`http://localhost:5001/api/files/books/${bookId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        let errJson;
        try { errJson = await res.json(); } catch(e) {}
        throw new Error(errJson?.message || 'PDF download failed or book not published.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (targetBook.title || 'book').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `BookVerse-${safeTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setBookmarkSavedToast('PDF downloaded successfully.');
    } catch (err) {
      setBookmarkSavedToast(err.message || 'PDF download failed.');
    } finally {
      setIsDownloadingPdf(false);
      setTimeout(() => setBookmarkSavedToast(''), 3500);
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

                {/* PDF Download Edition Button */}
                <button
                  onClick={() => handleDownloadPdf(book)}
                  disabled={isDownloadingPdf}
                  style={{ borderColor: theme.border, color: theme.text }}
                  className="p-2 rounded-full border hover:opacity-80 transition-opacity disabled:opacity-50"
                  title="Download PDF Edition"
                >
                  <Download className="w-4 h-4 text-[#7B021D]" />
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
              
              {/* Drawer Panel: Contents & Bookmarks */}
              <AnimatePresence>
                {tocOpen && (
                  <motion.div
                    initial={{ x: -280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -280, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ backgroundColor: theme.container, borderColor: theme.border }}
                    className="absolute left-0 top-0 bottom-0 w-80 z-30 border-r p-6 overflow-y-auto space-y-4 shadow-xl flex flex-col"
                  >
                    {/* Drawer Header & Tabs */}
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <button
                          onClick={() => setActiveDrawerTab('toc')}
                          className={`px-3 py-1.5 rounded-full border transition-all ${activeDrawerTab === 'toc' ? 'font-bold bg-[#7B021D] text-[#F5F5DA]' : 'opacity-70 hover:opacity-100'}`}
                          style={{ borderColor: theme.border }}
                        >
                          Contents
                        </button>
                        <button
                          onClick={() => setActiveDrawerTab('bookmarks')}
                          className={`px-3 py-1.5 rounded-full border transition-all ${activeDrawerTab === 'bookmarks' ? 'font-bold bg-[#7B021D] text-[#F5F5DA]' : 'opacity-70 hover:opacity-100'}`}
                          style={{ borderColor: theme.border }}
                        >
                          Bookmarks ({bookmarkedList.length})
                        </button>
                      </div>
                      <button onClick={() => setTocOpen(false)} style={{ color: theme.text }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tab 1: Table of Contents */}
                    {activeDrawerTab === 'toc' && (
                      <div className="space-y-2 font-mono text-xs flex-1">
                        {chapters.map((ch, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentPage(ch.startPage || ch.page);
                              setTocOpen(false);
                            }}
                            style={{
                              backgroundColor: currentPage >= (ch.startPage || ch.page) && (idx === chapters.length - 1 || currentPage < (chapters[idx + 1].startPage || chapters[idx + 1].page)) ? theme.bg : 'transparent',
                              color: theme.text,
                              borderColor: theme.border
                            }}
                            className="w-full text-left p-3 rounded-xl hover:opacity-80 transition-all flex items-center justify-between border"
                          >
                            <span className="line-clamp-1">{ch.title}</span>
                            <span className="opacity-60 text-[10px]">p. {ch.startPage || ch.page}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tab 2: Saved Bookmarks Panel */}
                    {activeDrawerTab === 'bookmarks' && (
                      <div className="space-y-2 font-mono text-xs flex-1">
                        {bookmarkedList.length === 0 ? (
                          <div className="text-center py-8 opacity-60 space-y-2">
                            <Bookmark className="w-8 h-8 mx-auto opacity-40" />
                            <p>No bookmarks saved yet.</p>
                            <p className="text-[10px]">Click the bookmark icon in the top header to save the current page.</p>
                          </div>
                        ) : (
                          bookmarkedList
                            .slice()
                            .sort((a, b) => (a.pageNumber || 1) - (b.pageNumber || 1))
                            .map((bm, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setCurrentPage(bm.pageNumber);
                                  setTocOpen(false);
                                }}
                                style={{
                                  backgroundColor: currentPage === bm.pageNumber ? theme.bg : 'transparent',
                                  color: theme.text,
                                  borderColor: theme.border
                                }}
                                className="w-full text-left p-3 rounded-xl hover:opacity-80 transition-all flex items-center justify-between border group"
                              >
                                <div className="min-w-0 pr-2">
                                  <span className="font-bold block text-xs truncate" style={{ color: theme.accent }}>
                                    Page {bm.pageNumber}
                                  </span>
                                  <span className="text-[10px] opacity-70 truncate block">
                                    {bm.chapterTitle || `Page ${bm.pageNumber}`}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-[#7B021D]/10 text-[#7B021D] font-bold text-[10px] shrink-0">
                                  Jump
                                </span>
                              </button>
                            ))
                        )}
                      </div>
                    )}
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
                      <h2 className="font-editorial-serif text-2xl sm:text-3xl font-bold mb-6" style={{ color: theme.accent }}>
                        {samplePageObj.chapterTitle}
                      </h2>

                      {samplePageObj.paragraphs.map((pText, pIdx) => (
                        <p key={pIdx} className="mb-6 leading-relaxed">
                          {pText}
                        </p>
                      ))}
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
