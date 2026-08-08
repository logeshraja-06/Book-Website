import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, User, Lock, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const mobileListVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  }
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isReader = currentUser?.role === 'reader';
  const isAuthor = currentUser?.role === 'author';
  const isPublisher = currentUser?.role === 'publisher';

  // Scroll Listener for Navbar Elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── STRICT ROLE-BASED NAVIGATION LINKS ──
  const baseLinks = [
    { name: 'Explore', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Authors', path: '/authors' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  const roleLink = isReader
    ? { name: 'My Shelf', path: '/my-shelf' }
    : isAuthor
    ? { name: 'Author Portal', path: '/author/dashboard' }
    : isPublisher
    ? { name: 'Publisher Workspace', path: '/publisher' }
    : null;

  const navLinks = roleLink ? [...baseLinks.slice(0, 4), roleLink, baseLinks[4]] : baseLinks;

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'rgba(250, 248, 246, 0.92)' : 'rgba(250, 248, 246, 1)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
        boxShadow: scrolled ? '0 4px 24px -2px rgba(43, 43, 43, 0.06)' : '0 0 0 0 rgba(0,0,0,0)',
        borderBottomColor: scrolled ? 'rgba(231, 217, 211, 1)' : 'rgba(231, 217, 211, 0.6)',
        paddingTop: scrolled ? '12px' : '16px',
        paddingBottom: scrolled ? '12px' : '16px',
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo & Two-Tone Wordmark */}
        <Link to="/" className="flex items-center gap-3.5 group select-none">
          <div className="w-10 h-10 rounded-xl bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center text-[#2B2B2B] group-hover:border-[#D3968C] transition-colors duration-300 shadow-sm shrink-0">
            <BookOpen className="w-5 h-5 text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors duration-300" />
          </div>
          <div className="flex flex-col">
            <div className="font-editorial-serif text-2xl tracking-tight font-semibold leading-none flex items-center">
              <span className="text-[#2B2B2B]">Book</span>
              <motion.span
                className="text-[#D3968C]"
                whileHover={{ color: '#C98579' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                Verse
              </motion.span>
            </div>
            <span className="text-[10px] tracking-[0.15em] uppercase font-mono text-[#6E6A67]/70 mt-1">
              Studio Ecosystem
            </span>
          </div>
        </Link>

        {/* Desktop Centered Navigation Links with Scale-Up */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium tracking-[-0.01em] text-[#6E6A67]">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname === link.path || location.pathname.startsWith(link.path);

            return (
              <motion.div
                key={link.name}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={link.path}
                  className={`relative py-1.5 transition-colors duration-200 hover:text-[#2B2B2B] ${
                    isActive ? 'text-[#2B2B2B] font-semibold' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar_active_underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Desktop Right Action Group with Soft Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex items-center gap-4"
        >
          {/* SEARCH CATALOG SHORTCUT */}
          <Link
            to="/books"
            className="p-2 rounded-full hover:bg-[#F4EEEA] text-[#6E6A67] hover:text-[#2B2B2B] transition-colors border border-[#E7D9D3]"
            title="Search Catalog"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* PUBLISHER ACCESS BUTTON */}
          {!isPublisher && (
            <Link
              to="/publisher/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7D9D3] bg-[#FAF8F6] text-xs font-mono uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] hover:border-[#D3968C] hover:bg-[#F4EEEA] transition-all duration-200"
              title="Internal Publisher & Catalog Registrar Entry Point"
            >
              <Lock className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Publisher Access</span>
            </Link>
          )}

          {/* ROLE-BASED AUTH & AVATAR ACTIONS */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={
                  isPublisher
                    ? '/publisher'
                    : isAuthor
                    ? '/author/dashboard'
                    : '/my-shelf'
                }
                className="flex items-center gap-2 p-1.5 pl-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] hover:bg-[#D3968C] transition-colors shadow-md group"
              >
                <span className="text-xs font-mono font-semibold">
                  {currentUser.name.split(' ')[0]} ({isPublisher ? 'Publisher' : isAuthor ? 'Author' : 'Reader'})
                </span>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/30"
                />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-all duration-300 shadow-md"
            >
              <User className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Sign In</span>
            </Link>
          )}

        </motion.div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#2B2B2B] hover:bg-[#F4EEEA] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE OVERLAY WITH STAGGERED CHILDREN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileListVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden border-b border-[#E7D9D3] bg-[#FAF8F6] px-6 py-6 space-y-6 overflow-hidden"
          >
            {currentUser && (
              <motion.div variants={mobileItemVariants} className="p-4 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E7D9D3]"
                  />
                  <div>
                    <h4 className="font-editorial-serif text-sm font-bold text-[#2B2B2B]">
                      {currentUser.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#D3968C] uppercase tracking-wider">
                      Role: {currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-lg text-[#6E6A67] hover:text-[#2B2B2B]"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <nav className="flex flex-col gap-3 text-[15px] font-medium text-[#6E6A67]">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileItemVariants}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block hover:text-[#2B2B2B] transition-colors py-2 border-b border-[#E7D9D3]/40 ${
                      location.pathname === link.path ? 'text-[#2B2B2B] font-semibold' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div variants={mobileItemVariants} className="pt-2 flex flex-col gap-3">
              {!isPublisher && (
                <Link
                  to="/publisher/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full border border-[#E7D9D3] text-center text-xs font-mono uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D3968C]" />
                  <span>Publisher Access</span>
                </Link>
              )}

              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-center text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#D3968C]" />
                  <span>Sign In to BookVerse</span>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
