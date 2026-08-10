import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Feather, ArrowUpRight, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import { handleImgError, DEFAULT_BOOK_COVER } from '../../utils/imageFallback';

export default function IndianBookshelf() {
  const { books = [] } = useData();

  // Filter Indian / Tamil literature works
  const indianBooks = books.filter(
    (b) =>
      b.language === 'Tamil' ||
      ['Historical Fiction', 'Poetry & Classics', 'Literary Realism'].includes(b.genre) ||
      ['kalki-krishnamurthy', 'vairamuthu', 'thiruvalluvar', 'apj-abdul-kalam', 'arundhati-roy'].includes(b.authorId)
  );

  const displayBooks = indianBooks.length > 0 ? indianBooks.slice(0, 4) : books.slice(0, 4);

  return (
    <section className="py-24 bg-[#F5F5DA] border-b border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E9E5C8] pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-1 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5" />
              Heritage & Literary Treasures
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-5xl text-[#211D1D] font-normal">
              From the Indian Bookshelf
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5E5E] max-w-md font-sans leading-relaxed">
            Celebrating classical Tamil epics, modern regional sagas, and enduring Indian literature preserved in high-fidelity hardcover editions.
          </p>
        </div>

        {/* 4-Column Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayBooks.map((book, idx) => {
            const bookSlug = book.slug || book.id || book._id;
            return (
              <motion.div
                key={bookSlug || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FFFDF3] rounded-3xl p-5 border border-[#E9E5C8] hover:border-[#212842] shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <Link to={`/books/${bookSlug}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md bg-[#F5F5DA]">
                    <img
                      src={book.coverImage || book.coverUrl || DEFAULT_BOOK_COVER}
                      alt={book.title}
                      onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm text-[10px] font-mono uppercase tracking-wider text-[#212842] font-bold border border-[#E9E5C8]">
                      {book.language || 'Tamil'} Edition
                    </div>
                  </Link>

                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#212842] font-bold block mb-1">
                    {book.genre}
                  </span>

                  <Link to={`/books/${bookSlug}`}>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] leading-snug group-hover:text-[#212842] transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#6B5E5E] font-sans mt-1">
                    By {book.author}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E9E5C8] flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#211D1D]">
                    {formatPrice(book.price)}
                  </span>
                  <Link
                    to={`/books/${bookSlug}`}
                    className="inline-flex items-center gap-1 text-[#212842] font-bold hover:underline"
                  >
                    <span>Read Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
