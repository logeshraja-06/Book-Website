import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { handleImgError, DEFAULT_AVATAR } from '../../utils/imageFallback';

export default function AuthorGalleryTile({ author, index = 0 }) {
  if (!author) return null;

  const authorSlug = author.slug || author.id || author.name?.toLowerCase().replace(/\s+/g, '-');
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to={`/authors/${authorSlug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E9E5C8] rounded-xs select-none">
          {/* Author Portrait Image (Grayscale by default, color + scale on hover) */}
          <img
            src={author.avatarUrl || DEFAULT_AVATAR}
            alt={author.name}
            onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
            className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/90 via-[#211D1D]/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />

          {/* Top Right Archive Index Badge */}
          <div className="absolute top-3.5 right-3.5 text-[10px] font-mono text-[#F5F5DA]/70 bg-[#211D1D]/30 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F5F5DA]/20">
            {formattedIndex}
          </div>

          {/* Bottom Anchored Text Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-[#F5F5DA]">
            <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">
              {author.name}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-[#E9E5C8]/80 mt-1 block translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {author.role || author.genre || 'Laureate Author'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
