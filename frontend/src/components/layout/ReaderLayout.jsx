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
    <div className="min-h-screen bg-[#F5F5DA] text-[#181616] selection:bg-[#212842] selection:text-[#F5F5DA] relative">
      {/* ── 1. PERSONAL READER MASTHEAD ── */}
      <section className="border-b border-[#D8CFAE] bg-[#F5F5DA] pt-12 pb-8 relative overflow-hidden shadow-xs">
        {/* Subtle Ambient Crimson Glow */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#212842]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-gradient-to-tr from-[#212842] to-[#D8CFAE] shadow-md shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#FFFDF3] bg-[#F8F6E5]"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#212842] font-bold block flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
                  Personal Reader Sanctuary
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#181616] font-bold">
                  {user.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#5F594F] shadow-2xs">
                <span className="flex items-center gap-1 font-bold text-[#181616]">
                  <BookOpen className="w-3.5 h-3.5 text-[#212842]" />
                  {user.stats?.booksRead || '14'} Books Read
                </span>
                <span className="h-3 w-px bg-[#D8CFAE]" />
                <span className="flex items-center gap-1 font-bold text-[#212842]">
                  <Flame className="w-3.5 h-3.5 text-[#212842]" />
                  {user.stats?.currentStreak || '18 Days'} Streak
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono font-bold uppercase tracking-wider text-[#181616] hover:border-[#212842] hover:text-[#212842] transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 text-[#212842]" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#D8CFAE]/60 -mb-8 overflow-x-auto pb-3 scrollbar-none">
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
                    isActive ? 'text-[#181616] font-bold' : 'text-[#5F594F] hover:text-[#181616]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="readerTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#212842]"
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
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10 bg-[#F5F5DA]">
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
