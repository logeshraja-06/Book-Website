import { useState, useEffect, useRef, useCallback } from 'react';
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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const lastScrollY = useRef(0);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser, logout } = useAuth();
  const { books = [], authors = [], wishlistBooks = [] } = useData();

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
    { name: 'Explore', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Authors', path: '/authors' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  const shelfPath = isReader
    ? '/my-shelf'
    : isAuthor
    ? '/author/dashboard'
    : isPublisher
    ? '/publisher'
    : '/my-shelf';

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: hidden ? -90 : 0,
          backgroundColor: scrolled ? 'rgba(245, 245, 218, 0.96)' : 'rgba(245, 245, 218, 0.82)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(33, 29, 29, 0.05)' : 'none',
          borderBottomColor: scrolled ? 'rgba(233, 229, 200, 0.9)' : 'rgba(233, 229, 200, 0.4)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* ── LEFT: REFINED BOOKVERSE WORDMARK ── */}
          <Link to="/" className="flex items-center gap-3.5 group select-none shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#211D1D] group-hover:border-[#7B021D] transition-all duration-300 shadow-xs">
              <BookOpen className="w-5 h-5 text-[#211D1D] group-hover:text-[#7B021D] transition-colors duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-editorial-serif text-[22px] font-semibold tracking-tight text-[#211D1D] leading-none">
                  BOOKVERSE
                </span>
                <span className="font-editorial-sans text-[10px] uppercase font-semibold text-[#7B021D] tracking-[0.2em] leading-none">
                  STUDIO
                </span>
              </div>
              <span className="font-editorial-sans text-[9px] uppercase tracking-[0.18em] text-[#6B5E5E] mt-1 font-medium">
                Curated Imprint
              </span>
            </div>
          </Link>

          {/* ── CENTER: DESKTOP NAVIGATION LINKS ── */}
          <nav className="hidden lg:flex items-center gap-9 font-editorial-sans text-[15px] font-medium tracking-[-0.01em] text-[#6B5E5E]">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 transition-colors duration-250 hover:text-[#211D1D] ${
                    isActive ? 'text-[#211D1D] font-semibold' : ''
                  }`}
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {link.name}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbar_active_indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7B021D] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT: SEARCH, BOOKMARKS, PUBLISHER ACCESS & AUTH ── */}
          <div className="hidden md:flex items-center gap-3.5">
            
            {/* Search Trigger Button with Keyboard Shortcut Badge */}
            <motion.button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              whileHover={{ y: -1, borderColor: '#7B021D' }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-3.5 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[#6B5E5E] hover:text-[#211D1D] transition-all text-xs font-editorial-sans font-medium shadow-xs"
              title="Search Catalogue (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#6B5E5E]" />
              <span className="hidden xl:inline text-[13px]">Search catalogue…</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F5F5DA] border border-[#E9E5C8] text-[10px] font-mono text-[#7B021D]">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </motion.button>

            {/* Bookmarks / Saved Shelf Shortcut */}
            <Link
              to={currentUser ? "/my-shelf/wishlist" : "/login"}
              className="relative p-2.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#7B021D] transition-all duration-200"
              title="My Saved Shelf / Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {wishlistBooks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                  {wishlistBooks.length}
                </span>
              )}
            </Link>

            {/* Publisher Workspace Link (Internal Portal) */}
            {!isPublisher && (
              <Link
                to="/publisher/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-[11px] font-editorial-sans uppercase tracking-[0.1em] font-semibold text-[#6B5E5E] hover:text-[#211D1D] hover:border-[#7B021D] transition-all duration-200"
                title="Publisher & Editorial Registrar"
              >
                <Lock className="w-3 h-3 text-[#7B021D]" />
                <span>Publisher</span>
              </Link>
            )}

            {/* User Profile / Auth Action */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] hover:border-[#7B021D] transition-all"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#E9E5C8]"
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
                        <span className="text-[10px] uppercase font-mono text-[#7B021D] tracking-wider font-bold">
                          {currentUser.role} Account
                        </span>
                      </div>

                      <Link
                        to={shelfPath}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#211D1D] hover:bg-[#F5F5DA] transition-colors"
                      >
                        <Library className="w-3.5 h-3.5 text-[#7B021D]" />
                        <span>{isPublisher ? 'Publisher Workspace' : isAuthor ? 'Author Dashboard' : 'My Reading Shelf'}</span>
                      </Link>

                      <Link
                        to="/my-shelf/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#211D1D] hover:bg-[#F5F5DA] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#6B5E5E]" />
                        <span>Profile & Settings</span>
                      </Link>

                      <div className="my-1 border-t border-[#E9E5C8]/60" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-700 hover:bg-red-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-editorial-sans font-semibold uppercase tracking-[0.08em] hover:bg-[#520014] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <User className="w-3.5 h-3.5 text-[#F5F5DA]" />
                <span>Sign In</span>
              </Link>
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
                    <span className="text-[10px] font-mono text-[#7B021D] uppercase tracking-wider font-bold">
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
                  className="p-2 rounded-xl text-[#6B5E5E] hover:text-red-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1 pb-6 border-b border-[#E9E5C8]">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#6B5E5E] block mb-3 font-bold">
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
                    className={`flex items-center justify-between py-3 font-editorial-serif text-2xl text-[#211D1D] hover:text-[#7B021D] transition-colors ${
                      location.pathname === link.path ? 'text-[#7B021D] font-bold' : ''
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
              <Link
                to={shelfPath}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#211D1D] hover:border-[#7B021D] flex items-center justify-center gap-2 shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#7B021D]" />
                <span>My Saved Shelf ({wishlistBooks.length})</span>
              </Link>

              {!isPublisher && (
                <Link
                  to="/publisher/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-full border border-[#E9E5C8] bg-[#FFFDF3] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] text-[#6B5E5E] hover:text-[#211D1D] flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#7B021D]" />
                  <span>Publisher Access Portal</span>
                </Link>
              )}

              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-center text-xs font-editorial-sans font-bold uppercase tracking-[0.1em] hover:bg-[#520014] transition-all shadow-md flex items-center justify-center gap-2"
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
              className="fixed inset-0 bg-[#2B2B2B]/40 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#FFFDF3] border border-[#E9E5C8] shadow-2xl overflow-hidden z-10"
            >
              {/* Search Header Input */}
              <div className="relative p-5 border-b border-[#E9E5C8] bg-[#F5F5DA] flex items-center gap-3.5">
                <Search className="w-5 h-5 text-[#7B021D] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setSearchModalOpen(false);
                      navigate(`/books?query=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  placeholder="Search titles, authors, genres, or ISBN…"
                  className="w-full bg-transparent text-[#211D1D] text-base font-editorial-sans placeholder-[#6B5E5E]/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-[#6B5E5E] hover:text-[#211D1D]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-2 py-1 rounded bg-[#FFFDF3] border border-[#E9E5C8] text-[10px] font-mono text-[#7B021D]">
                  ESC
                </kbd>
              </div>

              {/* Modal Body: Results or Suggestions */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                
                {/* Popular Topics Pill Tags */}
                {!searchQuery && (
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-[#6B5E5E] block mb-3 font-semibold">
                      Popular Curations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="px-3.5 py-1.5 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-editorial-sans text-[#211D1D] hover:border-[#7B021D] hover:bg-[#FFFDF3] transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtered Books Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-[#6B5E5E] font-semibold">
                      {searchQuery ? `Matching Works (${filteredBooks.length})` : 'Recommended Works'}
                    </span>
                    <Link
                      to="/books"
                      onClick={() => setSearchModalOpen(false)}
                      className="text-xs text-[#7B021D] hover:underline font-editorial-sans font-medium"
                    >
                      View All Catalog
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {filteredBooks.map((book) => {
                      const bookSlug = book.slug || book.id || book._id;
                      return (
                        <Link
                          key={bookSlug}
                          to={`/books/${bookSlug}`}
                          onClick={() => setSearchModalOpen(false)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5DA] border border-[#E9E5C8] hover:border-[#7B021D] hover:bg-[#FFFDF3] transition-all group shadow-2xs"
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded-md bg-[#FFFDF3] shrink-0"
                            />
                            <div>
                              <h4 className="font-editorial-serif text-base font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors line-clamp-1">
                                {book.title}
                              </h4>
                              <p className="text-xs font-editorial-sans text-[#6B5E5E] mt-0.5">
                                By {book.author} · <span className="font-mono text-[#7B021D]">{book.genre}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-editorial-sans font-tabular text-sm font-semibold text-[#211D1D] block">
                              {formatPrice(book.price)}
                            </span>
                            <span className="text-[10px] text-[#6B5E5E] font-mono">
                              ★ {book.rating || 4.8}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Filtered Authors Section */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-[#6B5E5E] block mb-3 font-semibold">
                    {searchQuery ? `Matching Authors (${filteredAuthors.length})` : 'Featured Literary Authors'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {filteredAuthors.map((author) => {
                      const authorSlug =
                        author.slug || author.id || author.name?.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={authorSlug}
                          to={`/authors/${authorSlug}`}
                          onClick={() => setSearchModalOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F5DA] border border-[#E9E5C8] hover:border-[#7B021D] hover:bg-[#FFFDF3] transition-all group shadow-2xs"
                        >
                          <img
                            src={author.avatarUrl}
                            alt={author.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#E9E5C8] shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-editorial-serif text-sm font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors truncate">
                              {author.name}
                            </h5>
                            <span className="text-[10px] font-editorial-sans text-[#6B5E5E] truncate block">
                              {author.role}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Search Modal Footer */}
              <div className="px-6 py-3.5 bg-[#F5F5DA] border-t border-[#E9E5C8] flex items-center justify-between text-xs font-editorial-sans text-[#6B5E5E]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#7B021D]" />
                  <span>Press <kbd className="font-mono text-[#211D1D]">↵ ENTER</kbd> to search full catalogue</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="hover:text-[#211D1D] transition-colors"
                >
                  Close (ESC)
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
