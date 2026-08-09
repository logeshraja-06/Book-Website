import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart2,
  User,
  LogOut,
  Sparkles,
  Feather,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthorLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Writing Studio', path: '/author/dashboard', icon: LayoutDashboard },
    { label: 'My Books', path: '/author/books', icon: BookOpen },
    { label: 'Upload Book', path: '/author/upload', icon: Upload },
    { label: 'Analytics', path: '/author/analytics', icon: BarChart2 },
    { label: 'Profile', path: '/author/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5DA] text-[#181616] selection:bg-[#7B021D] selection:text-[#F5F5DA] relative">
      
      {/* ── DEEP CHARCOAL & BURGUNDY WRITING STUDIO MASTHEAD ── */}
      <header className="bg-[#211D1D] text-[#F5F5DA] border-b border-[#D8CFAE]/20 pt-8 pb-6 relative overflow-hidden shadow-xl">
        {/* Ambient Crimson Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#7B021D]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#520014] border border-[#D8CFAE]/30 flex items-center justify-center text-[#F5F5DA] shadow-md">
                <Feather className="w-5 h-5 text-[#D8CFAE]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#D8CFAE] font-bold block flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#7B021D]" />
                  Author Writing Studio & Imprint Console
                </span>
                <h1 className="font-editorial-serif text-xl sm:text-2xl text-[#FFFDF3] font-bold">
                  Welcome back, {currentUser?.name || 'Author'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#520014]/60 border border-[#D8CFAE]/30 text-xs font-mono text-[#D8CFAE]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D8CFAE]" />
                <span>Verified Author Imprint</span>
              </div>
              
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-8 border-b border-[#D8CFAE]/15 -mb-6 overflow-x-auto pb-3 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/author/dashboard' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative text-xs font-mono uppercase tracking-wider font-bold transition-colors py-2.5 flex items-center gap-2 whitespace-nowrap min-h-[44px] ${
                    isActive ? 'text-[#FFFDF3]' : 'text-[#D8CFAE]/75 hover:text-[#FFFDF3]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7B021D]' : 'text-[#D8CFAE]/60'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="authorTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B021D]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Routed Content Panel */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative z-10 bg-[#F5F5DA]">
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
