import { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Layers, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { handleImgError, DEFAULT_AVATAR } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

export default function PublisherLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { fetchEditorialData } = useData();

  useEffect(() => {
    if (fetchEditorialData) {
      fetchEditorialData();
    }
  }, [fetchEditorialData]);

  const user = currentUser || {
    name: 'Editorial Control Desk',
    avatarUrl: DEFAULT_AVATAR
  };

  const publisherTabs = [
    { name: t('publisher.layout.tabWorkspace'), path: '/publisher' },
    { name: t('publisher.layout.tabQueue'), path: '/publisher/queue' },
    { name: t('publisher.layout.tabAuthors'), path: '/publisher/authors' },
    { name: t('publisher.layout.tabBooks'), path: '/publisher/books' },
    { name: t('publisher.layout.tabCategories'), path: '/publisher/categories' },
    { name: t('publisher.layout.tabReports'), path: '/publisher/reports' },
    { name: t('publisher.layout.tabProfile'), path: '/publisher/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5DA] selection:bg-[#212842] selection:text-[#F5F5DA] relative">
      
      {/* ── 1. DEEP CHARCOAL & BURGUNDY CONTROL DESK MASTHEAD ── */}
      <section className="bg-[#211D1D] text-[#F5F5DA] border-b border-[#E9E5C8]/20 pt-12 pb-8 relative overflow-hidden shadow-xl">
        {/* Subtle Ambient Crimson Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#212842]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatarUrl || DEFAULT_AVATAR}
                  alt={user.name}
                  onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#212842] shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#211D1D]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#E9E5C8] font-bold block flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#212842]" />
                  {t('publisher.layout.consoleEyebrow')}
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#FFFDF3] font-bold">
                  {user.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181E33]/60 border border-[#E9E5C8]/30 text-xs font-mono text-[#E9E5C8]">
                <ShieldCheck className="w-4 h-4 text-[#E9E5C8]" />
                <span>{t('publisher.layout.authorizedRegistrar')}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('publisher.layout.signOut')}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#E9E5C8]/15 -mb-8 overflow-x-auto pb-3 scrollbar-none">
            {publisherTabs.map((tab) => {
              const isActive =
                tab.path === '/publisher'
                  ? location.pathname === '/publisher' || location.pathname === '/publisher/dashboard'
                  : location.pathname.startsWith(tab.path);

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`relative text-sm font-editorial-sans transition-colors py-2.5 whitespace-nowrap min-h-[44px] inline-flex items-center ${
                    isActive ? 'text-[#FFFDF3] font-bold' : 'text-[#E9E5C8]/75 hover:text-[#FFFDF3]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="publisherTabUnderline"
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

      {/* ── 2. MAIN ROUTED WORKSPACE PANEL ── */}
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
