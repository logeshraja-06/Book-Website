import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Menu,
  X,
  User,
  Lock,
  LogOut,
  Search,
  Bookmark,
  ArrowRight,
  Sparkles,
  Command,
  Library,
  Feather,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  
  const lastScrollY = useRef(0);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser, logout } = useAuth();
  const { books = [], authors = [], wishlistBooks = [], activeReaderBook } = useData();

  const isReader = currentUser?.role === 'reader';
  const isAuthor = currentUser?.role === 'author';
  const isPublisher = currentUser?.role === 'publisher';

  // ── 1. INTELLIGENT SCROLL BEHAVIOR (Hide on scroll down, reveal on scroll up) ──
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 24) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide navbar on significant downward scroll; reveal immediately on upward scroll
      if (currentScrollY > 140 && currentScrollY > lastScrollY.current + 10) {
        setHidden(true);
        setUserDropdownOpen(false);
      } else if (currentScrollY < lastScrollY.current - 6 || currentScrollY < 120) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── 2. KEYBOARD SHORTCUTS (⌘K / Ctrl+K for Search, ESC to close) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [searchModalOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const isReadingView = location.pathname.startsWith('/reader-full') || location.pathname.startsWith('/reader') || activeReaderBook;
  if (isReadingView) return null;

  // ── 3. LIVE SEARCH FILTERING ──
  const filteredBooks = searchQuery.trim()
    ? books.filter(
        (b) =>
          b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : books.slice(0, 3);

  const filteredAuthors = searchQuery.trim()
    ? authors.filter(
        (a) =>
          a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.genres?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : authors.slice(0, 3);

  const popularSearches = [
    'Historical Fiction',
    'Economics',
    'Habit Formation',
    'Deep Work',
    'Tamil Classics',
  ];

  // ── 4. NAVIGATION LINKS ──
  const navLinks = [
    { name: t('navbar.explore'), path: '/' },
    { name: t('navbar.books'), path: '/books' },
    { name: t('navbar.authors'), path: '/authors' },
    { name: t('navbar.categories'), path: '/categories' },
    { name: t('navbar.about'), path: '/about' },
  ];

  const shelfPath = isReader
    ? '/my-shelf'
    : isAuthor
    ? '/author/dashboard'
    : isPublisher
    ? '/publisher'
    : '/my-shelf';

  const isHome = location.pathname === '/';
  const showTransparent = isHome && !scrolled;

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          backgroundColor: showTransparent ? 'rgba(245, 245, 218, 0)' : '#F5F5DA',
          backdropFilter: showTransparent ? 'blur(0px)' : 'blur(20px)',
          boxShadow: scrolled ? '0 4px 24px -2px rgba(33, 29, 29, 0.08)' : 'none',
          borderBottomColor: showTransparent ? 'transparent' : '#E9E5C8',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b transition-colors duration-300 relative"
      >
        {/* Subtle 1px inner highlight at the very top when scrolled */}
        {scrolled && (
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
            }}
          />
        )}
        <div className="w-full px-6 sm:px-8 lg:px-10 xl:px-12 h-20 sm:h-22 flex items-center justify-between gap-6">
          
          {/* ── LEFT: REFINED BOOKVERSE WORDMARK ── */}
          <Link to="/" className="flex items-center gap-3.5 group select-none shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#211D1D] group-hover:border-[#212842] transition-all duration-300 shadow-xs">
              <BookOpen className="w-5 h-5 text-[#212842] transition-colors duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-editorial-serif text-[23px] sm:text-[25px] font-semibold tracking-tight text-[#211D1D] leading-none">
                  BOOKVERSE
                </span>
                <span className="font-mono text-[11px] uppercase font-bold text-[#212842] tracking-[0.24em] leading-none">
                  STUDIO
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B5E5E] mt-1 font-medium">
                Curated Imprint
              </span>
            </div>
          </Link>

          {/* ── CENTER: DESKTOP NAVIGATION LINKS WITH GENEROUS SPACING ── */}
          <nav className="hidden lg:flex items-center gap-8 lg:gap-10 xl:gap-12 font-editorial-sans text-[16px] font-medium tracking-[-0.01em] text-[#6B5E5E]">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 px-3 rounded-full transition-colors duration-250 hover:text-[#211D1D] group ${
                    isActive ? 'text-[#211D1D] font-bold' : ''
                  }`}
                >
                  {/* Soft animated background pill on hover for inactive links */}
                  {!isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#212842]/[0.06] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
                    />
                  )}
                  <motion.span
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 block"
                  >
                    {link.name}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbarActiveUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, #212842 50%, transparent 100%)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT: SEARCH, PUBLISHER ACCESS & AUTH ── */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            
            {/* Search Trigger Button with Keyboard Shortcut Badge & Inner Glow */}
            <motion.button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              whileHover={{ y: -1, borderColor: '#212842', boxShadow: '0 0 0 3px rgba(33,40,66,0.08)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[#6B5E5E] hover:text-[#211D1D] transition-all text-xs font-editorial-sans font-medium shadow-xs"
              title="Search Catalogue (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#212842]" />
              <span className="hidden xl:inline text-[14px]">{t('navbar.searchPlaceholder')}</span>
              <motion.kbd
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F5F5DA] border border-[#E9E5C8] text-[11px] font-mono text-[#212842]"
              >
                <Command className="w-2.5 h-2.5" />K
              </motion.kbd>
            </motion.button>

            {/* Publisher Workspace Link (Internal Portal) */}
            {!isPublisher && (
              <Link
                to="/publisher/login"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[11px] font-mono uppercase tracking-[0.1em] font-bold text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#212842] transition-all duration-200"
                title="Publisher & Editorial Registrar"
              >
                <Lock className="w-3 h-3 text-[#212842]" />
                <span>{t('navbar.publisher')}</span>
              </Link>
            )}

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const newLang = i18n.language === 'en' ? 'ta' : 'en';
                i18n.changeLanguage(newLang);
                localStorage.setItem('bookverse_lang', newLang);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[11px] font-mono uppercase tracking-[0.1em] font-bold text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#212842] transition-all duration-200"
              title={t('navbar.language')}
            >
              <span>{i18n.language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* User Profile / Auth Action */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] hover:border-[#212842] transition-all shadow-2xs"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser.name}
                    className="w-7.5 h-7.5 rounded-full object-cover border border-[#E9E5C8]"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B5E5E]" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] shadow-xl p-2 z-50 font-editorial-sans"
                    >
                      <div className="px-3 py-2.5 border-b border-[#E9E5C8]/60 mb-1">
                        <p className="text-xs font-semibold text-[#211D1D] truncate">{currentUser.name}</p>
                        <span className="text-[11px] uppercase font-mono text-[#212842] tracking-wider font-bold">
                          {currentUser.role} Account
                        </span>
                      </div>

                      <Link
                        to={shelfPath}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-[#211D1D] hover:bg-[#F5F5DA] transition-colors"
                      >
                        <Library className="w-3.5 h-3.5 text-[#212842]" />
                        <span>{isPublisher ? 'Publisher Workspace' : isAuthor ? 'Author Dashboard' : t('navbar.myShelf')}</span>
                      </Link>

                      <Link
                        to="/my-shelf/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-[#211D1D] hover:bg-[#F5F5DA] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#6B5E5E]" />
                        <span>{t('navbar.profileSettings')}</span>
                      </Link>

                      <div className="my-1 border-t border-[#E9E5C8]/60" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-rose-700 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('navbar.signOut')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[#211D1D] text-[11px] font-mono font-bold uppercase tracking-[0.1em] hover:border-[#212842] hover:bg-[#F5F5DA] transition-all duration-250 shadow-2xs"
                  >
                    <span>{t('navbar.login')}</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                  <button
                    type="button"
                    onClick={() => setRoleModalOpen(true)}
                    className="relative group overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#212842] text-[#F5F5DA] text-[11px] font-mono font-bold uppercase tracking-[0.1em] hover:bg-[#181E33] transition-all duration-250 shadow-md whitespace-nowrap"
                  >
                    {/* Shimmer sheen sweep on hover */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)',
                        animation: 'heroShimmerSheen 1.1s ease-in-out',
                      }}
                    />
                    <User className="w-3.5 h-3.5 text-[#F5F5DA] relative z-10" />
                    <span className="relative z-10">{t('navbar.signIn')}</span>
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* ── MOBILE MENU TRIGGER BUTTON ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 rounded-full border border-[#E9E5C8] text-[#6B5E5E] hover:text-[#211D1D] transition-colors"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full border border-[#E9E5C8] text-[#211D1D] hover:bg-[#FFFDF3] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* ── MOBILE EDITORIAL NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-x-0 top-20 z-40 bg-[#F5F5DA] border-b border-[#E9E5C8] shadow-2xl px-6 py-8 overflow-y-auto max-h-[calc(100vh-5rem)]"
          >
            {/* User Banner if logged in */}
            {currentUser && (
              <div className="mb-6 p-4 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E9E5C8]"
                  />
                  <div>
                    <h4 className="font-editorial-serif text-base font-semibold text-[#211D1D]">
                      {currentUser.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#212842] uppercase tracking-wider font-bold">
                      Role: {currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-2 rounded-xl text-[#6B5E5E] hover:text-rose-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1 pb-6 border-b border-[#E9E5C8]">
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#6B5E5E] block mb-3 font-bold">
                Catalogue Navigation
              </span>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3 font-editorial-serif text-2xl text-[#211D1D] hover:text-[#212842] transition-colors ${
                      location.pathname === link.path ? 'text-[#212842] font-bold' : ''
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#E9E5C8]" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-6 space-y-3">
              {/* Mobile Language Toggle */}
              <button
                type="button"
                onClick={() => {
                  const newLang = i18n.language === 'en' ? 'ta' : 'en';
                  i18n.changeLanguage(newLang);
                  localStorage.setItem('bookverse_lang', newLang);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#211D1D] hover:border-[#212842] flex items-center justify-center gap-2 shadow-2xs"
                title={t('navbar.language')}
              >
                <span>{i18n.language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              <Link
                to={shelfPath}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#211D1D] hover:border-[#212842] flex items-center justify-center gap-2 shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#212842]" />
                <span>My Saved Shelf ({wishlistBooks.length})</span>
              </Link>

              {!isPublisher && (
                <Link
                  to="/publisher/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#6B5E5E] hover:text-[#211D1D] flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#212842]" />
                  <span>Publisher Access Portal</span>
                </Link>
              )}

              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-center text-xs font-mono font-bold uppercase tracking-[0.1em] hover:bg-[#181E33] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#F5F5DA]" />
                  <span>Sign In to BookVerse</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDABLE SEARCH OVERLAY MODAL (⌘K / Ctrl+K) ── */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-gradient-to-b from-[#181E33]/50 to-[#2B2B2B]/40 backdrop-blur-lg"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#FFFDF3] border border-[#E9E5C8] shadow-[0_24px_64px_-12px_rgba(24,30,51,0.35),0_0_0_1px_rgba(33,40,66,0.15)] overflow-hidden z-10"
            >
              {/* Search Header Input */}
              <div className="relative p-5 border-b border-[#E9E5C8] bg-[#F5F5DA] flex items-center gap-3.5 group/input">
                <Search className="w-5 h-5 text-[#212842] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by title, author, genre, or ISBN…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-editorial-sans text-[#211D1D] focus:outline-none placeholder:text-[#6B5E5E]"
                />
                {/* Center-expanding focus underline bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#212842] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 origin-center" />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-[#6B5E5E] hover:text-[#211D1D]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-3 py-1.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[#211D1D] hover:text-[#212842] hover:border-[#212842] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold shadow-2xs"
                  title="Close Search (ESC)"
                  aria-label="Close Search"
                >
                  <X className="w-3.5 h-3.5 text-[#212842]" />
                  <span>CLOSE</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                
                {/* Popular Tags */}
                {!searchQuery && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B5E5E] block font-bold">
                      Popular Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-editorial-sans text-[#211D1D] hover:border-[#212842] transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Books Results */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#212842] font-bold">
                      Matching Volumes
                    </span>
                    <span className="text-[11px] font-mono text-[#6B5E5E]">
                      {filteredBooks.length} titles
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredBooks.map((book, idx) => {
                      const bookSlug = book.slug || book.id || book._id;
                      return (
                        <motion.div key={`${book.id || book._id || 'search'}-${idx}`} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                          <Link
                            to={`/books/${bookSlug}`}
                            onClick={() => setSearchModalOpen(false)}
                            className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5DA]/60 border border-[#E9E5C8] hover:border-[#212842] hover:bg-[#F5F5DA] transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={book.coverImage || book.coverUrl}
                                alt={book.title}
                                className="w-9 h-12 rounded-lg object-cover border border-[#E9E5C8] shrink-0"
                              />
                              <div>
                                <h5 className="font-editorial-serif text-base font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
                                  {book.title}
                                </h5>
                                <p className="text-xs text-[#6B5E5E] font-sans">
                                  By {book.author} · {book.genre}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#212842]">
                              {formatPrice(book.price)}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Authors Results */}
                <div className="space-y-3 pt-4 border-t border-[#E9E5C8]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#212842] font-bold block">
                    Featured Authors
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {filteredAuthors.map((author) => (
                      <motion.div key={author.id || author._id} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                        <Link
                          to="/authors"
                          onClick={() => setSearchModalOpen(false)}
                          className="p-3 rounded-2xl bg-[#F5F5DA]/60 border border-[#E9E5C8] hover:border-[#212842] transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={author.avatarUrl || author.image}
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E9E5C8]"
                          />
                          <div className="min-w-0">
                            <h6 className="font-editorial-serif text-sm font-bold text-[#211D1D] truncate group-hover:text-[#212842] transition-colors">
                              {author.name}
                            </h6>
                            <p className="text-[10px] font-mono text-[#6B5E5E] truncate">
                              {author.role || 'Author'}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#E9E5C8] bg-[#F5F5DA]/50 flex items-center justify-between text-xs font-mono text-[#6B5E5E]">
                <span>Press ESC or click backdrop to close</span>
                <Link
                  to="/books"
                  onClick={() => setSearchModalOpen(false)}
                  className="text-[#212842] font-bold hover:underline flex items-center gap-1"
                >
                  <span>View All Books</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ROLE SELECTION MODAL ("Who are you joining as?") ── */}
      <AnimatePresence>
        {roleModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-[#FFFDF3] text-[#211D1D] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#E9E5C8] space-y-8"
            >
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F5F5DA] text-[#6B5E5E] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block">
                  Membership Portal
                </span>
                <h2 className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
                  Who are you joining as?
                </h2>
                <p className="text-xs text-[#6B5E5E] font-sans">
                  Select your account type to proceed with registration
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Reader Card */}
                <motion.div
                  whileHover={{ y: -3, borderColor: '#212842' }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E9E5C8] shadow-sm space-y-4 flex flex-col justify-between group cursor-pointer"
                  onClick={() => {
                    setRoleModalOpen(false);
                    navigate('/register/reader');
                  }}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#212842] group-hover:bg-[#212842] group-hover:text-[#F5F5DA] transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
                      Reader
                    </h3>
                    <p className="text-xs text-[#6B5E5E] leading-relaxed">
                      Explore curated manuscripts, build your personal library, save earmarked wishlists, and track reading progress.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider group-hover:bg-[#181E33] transition-colors"
                  >
                    Create Reader Account →
                  </button>
                </motion.div>

                {/* Author Card */}
                <motion.div
                  whileHover={{ y: -3, borderColor: '#212842' }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E9E5C8] shadow-sm space-y-4 flex flex-col justify-between group cursor-pointer"
                  onClick={() => {
                    setRoleModalOpen(false);
                    navigate('/register/author');
                  }}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#212842] group-hover:bg-[#212842] group-hover:text-[#F5F5DA] transition-colors">
                      <Feather className="w-6 h-6" />
                    </div>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
                      Author
                    </h3>
                    <p className="text-xs text-[#6B5E5E] leading-relaxed">
                      Submit manuscripts for editorial evaluation, manage pen name imprints, track review status, and view reader analytics.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-full bg-[#211D1D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider group-hover:bg-[#212842] transition-colors"
                  >
                    Become an Author →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
