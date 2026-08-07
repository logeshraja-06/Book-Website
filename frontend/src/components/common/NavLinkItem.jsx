import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavLinkItem({ name, path, activeUnderlineId, onClick }) {
  const location = useLocation();
  const isActive =
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors py-2 whitespace-nowrap inline-flex items-center ${
        isActive ? 'text-[#2B2B2B] font-semibold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
      }`}
    >
      {name}
      {isActive && activeUnderlineId && (
        <motion.div
          layoutId={activeUnderlineId}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
