import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF8F6]">
      <section className="border-b border-[#E7D9D3] bg-[#FAF8F6] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#E7D9D3]"
              />
              <div>
                <span className="text-[11px] uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
                  Personal Reader Shelf
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#2B2B2B] font-bold">
                  {user.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-mono text-[#6E6A67]">
                <span>{user.stats?.booksRead || '12'} Books Read</span>
                <span className="h-3 w-px bg-[#E7D9D3]" />
                <span className="text-[#2B2B2B] font-semibold">{user.stats?.currentStreak || '14 Days'} Streak</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
              >
                Sign Out
              </Button>
            </div>
          </div>

          <nav className="flex items-center gap-8 border-b border-[#E7D9D3]/60 -mb-8 overflow-x-auto pb-3 scrollbar-hide">
            {navTabs.map((tab) => {
              const isActive =
                tab.path === '/my-shelf'
                  ? location.pathname === '/my-shelf'
                  : location.pathname.startsWith(tab.path);

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`relative text-sm font-medium transition-colors py-2.5 whitespace-nowrap min-h-[44px] inline-flex items-center ${
                    isActive ? 'text-[#2B2B2B] font-semibold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="readerTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
