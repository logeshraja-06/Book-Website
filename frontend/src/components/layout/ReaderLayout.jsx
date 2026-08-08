import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sparkles, BookOpen, Flame } from 'lucide-react';
import Button from '../common/Button';

export default function ReaderLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const user = currentUser || {
    name: 'Reader',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  };

  const navTabs = [
    { name: 'My Shelf', path: '/my-shelf' },
    { name: 'Wishlist', path: '/my-shelf/wishlist' },
    { name: 'Bookmarks', path: '/my-shelf/bookmarks' },
    { name: 'Reviews', path: '/my-shelf/reviews' },
    { name: 'Profile', path: '/my-shelf/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] selection:bg-[#7B021D] selection:text-[#F5F5DA] relative">
      {/* ── 1. PERSONAL READER MASTHEAD ── */}
      <section className="border-b border-[#E7D9D3] bg-gradient-to-br from-[#F4EEEA] via-[#FFFDF3] to-[#FAF8F6] pt-12 pb-8 relative overflow-hidden shadow-xs">
        {/* Subtle Ambient Crimson Glow */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#D3968C]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-gradient-to-tr from-[#7B021D] to-[#D3968C] shadow-md shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#FFFDF3] bg-[#F4EEEA]"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#7B021D] font-bold block flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7B021D]" />
                  Personal Reader Sanctuary
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#2B2B2B] font-bold">
                  {user.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#E7D9D3] text-xs font-mono text-[#6E6A67] shadow-2xs">
                <span className="flex items-center gap-1 font-bold text-[#2B2B2B]">
                  <BookOpen className="w-3.5 h-3.5 text-[#7B021D]" />
                  {user.stats?.booksRead || '14'} Books Read
                </span>
                <span className="h-3 w-px bg-[#E7D9D3]" />
                <span className="flex items-center gap-1 font-bold text-[#7B021D]">
                  <Flame className="w-3.5 h-3.5 text-[#7B021D]" />
                  {user.stats?.currentStreak || '18 Days'} Streak
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#E7D9D3] text-xs font-mono font-bold uppercase tracking-wider text-[#2B2B2B] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 text-[#7B021D]" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#E7D9D3]/60 -mb-8 overflow-x-auto pb-3 scrollbar-none">
            {navTabs.map((tab) => {
              const isActive =
                tab.path === '/my-shelf'
                  ? location.pathname === '/my-shelf'
                  : location.pathname.startsWith(tab.path);

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`relative text-sm font-editorial-sans transition-colors py-2.5 whitespace-nowrap min-h-[44px] inline-flex items-center ${
                    isActive ? 'text-[#2B2B2B] font-bold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="readerTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B021D]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
