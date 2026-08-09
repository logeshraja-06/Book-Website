import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from './BookCover';

export default function BookTiltCard({ book, index = 0 }) {
  const { wishlistBooks = [], toggleWishlist } = useData();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col justify-between h-full select-none"
    >
      <div>
        {/* 3D Perspective Standalone Physical Book Object with Floating Bookmark */}
        <div className="book-container relative mb-4">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="book-card-3d relative rounded-r-2xl rounded-l-xs overflow-hidden shadow-md group-hover:shadow-2xl transition-shadow duration-400"
          >
            <Link to={`/books/${bookSlug}`} className="block relative aspect-[3/4] overflow-hidden">
              <BookCover
                book={book}
                variant="3d"
                imageClassName="group-hover:scale-[1.02] transition-transform duration-400 ease-out"
              />
            </Link>
          </motion.div>

          {/* Floating Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(book.id || book._id);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#FFFDF3]/95 backdrop-blur-md border border-[#E9E5C8] text-[#211D1D] hover:text-[#212842] transition-colors shadow-sm"
            title="Bookmark Title"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
          </button>
        </div>

        {/* Standalone Metadata Below 3D Book */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold block">
            {book.genre || book.category || 'Literature'}
          </span>

          <Link to={`/books/${bookSlug}`}>
            <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] line-clamp-1 group-hover:text-[#212842] transition-colors leading-snug">
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-[#6B5E5E] font-sans truncate">
            By {book.author}
          </p>
        </div>
      </div>

      {/* Footer Row with Price and Rating Pill */}
      <div className="pt-2 mt-3 border-t border-[#E9E5C8]/60 flex items-center justify-between font-mono text-xs">
        <span className="font-editorial-sans font-tabular text-[15px] font-bold text-[#211D1D]">
          {formatPrice(book.price)}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#212842] font-editorial-sans font-bold text-[11px] shadow-2xs">
          <Star className="w-3 h-3 fill-[#212842]" />
          <span>{book.rating || 4.8}</span>
        </span>
      </div>
    </motion.div>
  );
}
