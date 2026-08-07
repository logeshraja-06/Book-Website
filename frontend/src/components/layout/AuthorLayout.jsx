import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart2,
  User,
  LogOut,
  Sparkles,
  ArrowUpRight,
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
    { label: 'Dashboard', path: '/author/dashboard', icon: LayoutDashboard },
    { label: 'My Books', path: '/author/books', icon: BookOpen },
    { label: 'Upload Book', path: '/author/upload', icon: Upload },
    { label: 'Analytics', path: '/author/analytics', icon: BarChart2 },
    { label: 'Profile', path: '/author/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F6] text-[#2B2B2B]">
      {/* ── Sub-Header Navigation Bar ── */}
      <header className="border-b border-[#E7D9D3] bg-[#FAF8F6]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/40 text-[#2B2B2B] font-mono text-xs uppercase tracking-wider font-semibold">
              Author Portal
            </span>
            <span className="text-xs text-[#6E6A67] hidden sm:inline">
              Welcome back, <strong className="text-[#2B2B2B]">{currentUser?.name || 'Author'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/author/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative py-3 text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  isActive ? 'text-[#2B2B2B]' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D3968C]" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="author_tab_underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <Outlet />
      </main>
    </div>
  );
}
