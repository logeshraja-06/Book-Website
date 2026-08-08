import { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Layers, ShieldCheck, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';

export default function PublisherLayout() {
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
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  };

  const publisherTabs = [
    { name: 'Publisher Workspace', path: '/publisher' },
    { name: 'Submission Queue', path: '/publisher/queue' },
    { name: 'Authors', path: '/publisher/authors' },
    { name: 'Books', path: '/publisher/books' },
    { name: 'Categories', path: '/publisher/categories' },
    { name: 'Reports', path: '/publisher/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      
      {/* Publisher Workspace Masthead */}
      <section className="border-b border-[#E9E5C8] bg-[#F5F5DA] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E9E5C8]"
              />
              <div>
                <span className="text-[11px] uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
                  Internal Back-Office Module
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#211D1D] font-bold">
                  Publisher Workspace
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono text-[#6B5E5E]">
                <ShieldCheck className="w-4 h-4 text-[#7B021D]" />
                <span>Desk Registrar</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} icon={LogOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Minimalist Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#E9E5C8]/60 -mb-8 overflow-x-auto pb-3 scrollbar-hide">
            {publisherTabs.map((tab) => {
              const isActive =
                tab.path === '/publisher'
                  ? location.pathname === '/publisher' || location.pathname === '/publisher/dashboard'
                  : location.pathname.startsWith(tab.path);

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`relative text-sm font-medium transition-colors py-2.5 whitespace-nowrap min-h-[44px] inline-flex items-center ${
                    isActive ? 'text-[#211D1D] font-bold' : 'text-[#6B5E5E] hover:text-[#211D1D]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="publisherTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B021D]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>
      </section>

      {/* Main Routed Workspace Panel */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
