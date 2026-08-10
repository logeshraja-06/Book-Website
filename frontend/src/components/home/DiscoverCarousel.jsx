import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, Star, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';

export default function DiscoverCarousel() {
  const { books = [], wishlistBooks = [], toggleWishlist } = useData();
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -360 : 360;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const publishedBooks = books.filter((b) => b.status === 'Published');
  const carouselBooks = publishedBooks.length > 0 ? publishedBooks : books;

  return (
    <section className="py-20 bg-[#F5F5DA] border-b border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        
        {/* Section Header with Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E5C8] pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-1">
              Curated Index
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#211D1D] font-normal">
              Books you'll want to keep close
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[#E9E5C8] bg-[#F5F5DA] flex items-center justify-center text-[#211D1D] hover:border-[#212842] hover:text-[#212842] transition-colors"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[#E9E5C8] bg-[#F5F5DA] flex items-center justify-center text-[#211D1D] hover:border-[#212842] hover:text-[#212842] transition-colors"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Viewport */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
        >
          {carouselBooks.map((book, idx) => {
            const bookSlug = book.slug || book.id || book._id;
            const isWishlisted = wishlistBooks.some((b) => (b.id || b._id) === (book.id || book._id));

            return (
              <motion.div
                key={`${bookSlug || 'disc'}-${idx}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="w-72 shrink-0 snap-start bg-gradient-to-b from-[#FFFDF3] to-[#F5F5DA] rounded-none p-3.5 border border-[#E9E5C8] flex flex-col justify-between shadow-xs hover:shadow-[0_20px_40px_-12px_rgba(24,30,51,0.18),0_2px_6px_-1px_rgba(24,30,51,0.12),inset_0_0_0_1.5px_rgba(33,40,66,0.35)] transition-all duration-300 ease-out group relative overflow-hidden cursor-pointer"
              >
                <div>
                  <Link to={`/books/${bookSlug}`} className="block relative aspect-[3/4] rounded-none overflow-hidden mb-3 bg-[#FFFDF3] border border-[#E9E5C8]/80">
                    <img
                      src={book.coverImage || book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Diagonal shine-sweep overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-transform duration-900 z-10"
                      style={{
                        background: 'linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                      }}
                    />

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(book.id || book._id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm border border-[#E9E5C8] text-[#211D1D] hover:text-[#212842] transition-colors shadow-xs z-20 group/btn"
                    >
                      <Bookmark className={`w-3.5 h-3.5 transition-transform duration-200 ${isWishlisted ? 'fill-[#212842] text-[#212842] scale-110' : ''}`} />
                      {isWishlisted && (
                        <span className="absolute inset-0 rounded-full border border-[#212842]/40 animate-ping pointer-events-none opacity-40" />
                      )}
                    </motion.button>
                  </Link>

                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#212842] font-bold block mb-1">
                    {book.genre}
                  </span>

                  <Link to={`/books/${bookSlug}`}>
                    <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] truncate group-hover:text-[#212842] transition-colors duration-300 ease-out">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#6B5E5E] font-sans truncate mt-0.5">
                    By {book.author}
                  </p>
                </div>

                <div className="relative pt-3.5 mt-3.5 flex items-center justify-between font-mono text-xs">
                  {/* Top 1px gradient border line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, #E9E5C8 20%, #E9E5C8 80%, transparent 100%)',
                    }}
                  />
                  <span className="font-bold text-[#211D1D]">
                    {formatPrice(book.price)}
                  </span>
                  <span className="flex items-center gap-1 text-[#212842] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#212842]" />
                    {book.rating || 4.8}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
