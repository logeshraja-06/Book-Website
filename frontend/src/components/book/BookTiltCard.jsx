import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from './BookCover';

export default function BookTiltCard({ book, index = 0 }) {
  const { wishlistBooks = [], toggleWishlist } = useData();

  if (!book) return null;

  const bookSlug = book.slug || book.id || book._id;
  const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col justify-between"
    >
      <div>
        {/* 3D Tilting Book Cover Container */}
        <div className="book-container relative">
          <Link
            to={`/books/${bookSlug}`}
            className="book-card-3d relative block rounded-2xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8]"
          >
            <div className="book-spine-depth" />
            <BookCover
              book={book}
              variant="default"
              imageClassName="group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Absolute Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(book.id || book._id);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm border border-[#E9E5C8] text-[#211D1D] hover:text-[#7B021D] transition-colors shadow-2xs"
            title="Bookmark Title"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7B021D] text-[#7B021D]' : ''}`} />
          </button>
        </div>

        {/* Un-tilted Metadata Below Cover */}
        <div className="mt-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#7B021D] font-bold block">
            {book.genre || book.category}
          </span>

          <Link to={`/books/${bookSlug}`}>
            <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] line-clamp-1 group-hover:text-[#7B021D] transition-colors leading-snug">
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-[#6B5E5E] font-sans truncate">
            By {book.author}
          </p>
        </div>
      </div>

      {/* Footer Row with Price and Rating */}
      <div className="pt-3 mt-3 border-t border-[#E9E5C8] flex items-center justify-between font-mono text-xs">
        <span className="font-editorial-sans font-tabular text-[15px] font-bold text-[#211D1D]">
          {formatPrice(book.price)}
        </span>

        <div className="flex items-center gap-1 text-[#7B021D] font-bold">
          <Star className="w-3.5 h-3.5 fill-[#7B021D]" />
          <span>{book.rating || 4.8}</span>
        </div>
      </div>
    </motion.div>
  );
}
