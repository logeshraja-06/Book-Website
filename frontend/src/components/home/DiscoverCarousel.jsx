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
            <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block mb-1">
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
              className="w-10 h-10 rounded-full border border-[#E9E5C8] bg-[#F5F5DA] flex items-center justify-center text-[#211D1D] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[#E9E5C8] bg-[#F5F5DA] flex items-center justify-center text-[#211D1D] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors"
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
              <div
                key={`${bookSlug || 'disc'}-${idx}`}
                className="w-72 shrink-0 snap-start bg-[#F5F5DA] rounded-3xl p-5 border border-[#E9E5C8] flex flex-col justify-between shadow-2xs hover:border-[#7B021D] hover:shadow-md transition-all group"
              >
                <div>
                  <Link to={`/books/${bookSlug}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-[#FFFDF3] border border-[#E9E5C8]">
                    <img
                      src={book.coverImage || book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(book.id || book._id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm border border-[#E9E5C8] text-[#211D1D] hover:text-[#7B021D] transition-colors"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7B021D] text-[#7B021D]' : ''}`} />
                    </button>
                  </Link>

                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#7B021D] font-bold block mb-1">
                    {book.genre}
                  </span>

                  <Link to={`/books/${bookSlug}`}>
                    <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] truncate group-hover:text-[#7B021D] transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#6B5E5E] font-sans truncate mt-0.5">
                    By {book.author}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E9E5C8] flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#211D1D]">
                    {formatPrice(book.price)}
                  </span>
                  <span className="flex items-center gap-1 text-[#7B021D] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#7B021D]" />
                    {book.rating || 4.8}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
