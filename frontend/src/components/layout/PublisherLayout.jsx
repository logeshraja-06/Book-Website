import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Layers, ShieldCheck, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';

export default function PublisherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
    <div className="min-h-screen bg-[#FAF8F6]">
      
      {/* Publisher Workspace Masthead */}
      <section className="border-b border-[#E7D9D3] bg-[#FAF8F6] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E7D9D3]"
              />
              <div>
                <span className="text-[11px] uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
                  Internal Back-Office Module
                </span>
                <h1 className="font-editorial-serif text-2xl sm:text-3xl text-[#2B2B2B] font-bold">
                  Publisher Workspace
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-mono text-[#6E6A67]">
                <ShieldCheck className="w-4 h-4 text-[#D3968C]" />
                <span>Desk Registrar</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} icon={LogOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Minimalist Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#E7D9D3]/60 -mb-8 overflow-x-auto pb-3 scrollbar-hide">
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
                    isActive ? 'text-[#2B2B2B] font-semibold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="publisherTabUnderline"
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

      {/* Main Content Area */}
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
