import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import Button from '../common/Button';

export default function FeaturedSection() {
  const { books } = useData();
  const publishedBooks = books.filter((b) => b.status === 'Published');
  const spotlightBook = publishedBooks.find((b) => b.editorPick) || publishedBooks[0];
  const secondaryBooks = publishedBooks.filter((b) => (b.slug || b.id) !== (spotlightBook?.slug || spotlightBook?.id)).slice(0, 4);

  if (!spotlightBook) return null;

  const spotlightSlug = spotlightBook.slug || spotlightBook.id || spotlightBook._id;
  const spotlightAuthorSlug = spotlightBook.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const spotlightCategorySlug = spotlightBook.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';

  return (
    <section id="featured" className="py-24 bg-[#F4EEEA] border-y border-[#E7D9D3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] block mb-2 font-semibold">
              Curated Selections
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] font-normal tracking-tight">
              Featured on BookVerse
            </h2>
          </div>
          <p className="text-sm text-[#6E6A67] max-w-md leading-relaxed">
            Hand-curated manuscripts and seminal titles chosen by our editorial board for their intellectual rigor, narrative craft, and cultural resonance.
          </p>
        </div>

        {/* Asymmetric Editorial Layout: Spotlight + Supporting Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Spotlight Hero Book */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl p-8 border border-[#E7D9D3] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/40 text-[#2B2B2B] text-xs font-medium tracking-wide">
                  Editor's Spotlight
                </span>
                <span className="text-xs font-mono text-[#6E6A67]">
                  {spotlightBook.bookCode || `ISBN ${spotlightBook.isbn || '978-81-000001'}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <Link to={`/books/${spotlightSlug}`} className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-[#F4EEEA] block">
                  <img
                    src={spotlightBook.coverUrl}
                    alt={spotlightBook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="sm:col-span-7 space-y-3">
                  <Link
                    to={`/categories/${spotlightCategorySlug}`}
                    className="text-xs uppercase tracking-wider font-mono text-[#D3968C] hover:underline"
                  >
                    {spotlightBook.genre}
                  </Link>
                  <Link to={`/books/${spotlightSlug}`}>
                    <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] leading-tight group-hover:text-[#C98579] transition-colors">
                      {spotlightBook.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#6E6A67]">
                    By <Link to={`/authors/${spotlightAuthorSlug}`} className="text-[#2B2B2B] font-medium hover:text-[#D3968C] transition-colors">{spotlightBook.author}</Link>
                  </p>
                  <p className="text-xs text-[#6E6A67] italic leading-relaxed pt-1">
                    "{spotlightBook.synopsis}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7D9D3] flex items-center justify-between mt-6">
              <div>
                <span className="text-xs text-[#6E6A67] block">Hardcover Editorial</span>
                <span className="font-editorial-serif font-tabular text-2xl font-bold text-[#2B2B2B]">{formatPrice(spotlightBook.price)}</span>
              </div>
              <Button to={`/books/${spotlightSlug}`} size="sm" icon={ArrowUpRight}>
                View Details
              </Button>
            </div>
          </motion.div>

          {/* Supporting Titles (Right Column Stack) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryBooks.map((book, idx) => {
              const bookSlug = book.slug || book.id || book._id;
              const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
              const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
              return (
                <motion.div
                  key={bookSlug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E7D9D3] flex flex-col justify-between hover:border-[#D3968C] transition-all duration-300 group block h-full">
                    <div>
                      <Link to={`/books/${bookSlug}`} className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EEEA] mb-4 block">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <Link to={`/categories/${categorySlug}`} className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67] hover:text-[#D3968C] transition-colors">
                        {book.genre}
                      </Link>
                      <Link to={`/books/${bookSlug}`}>
                        <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B] line-clamp-1 mt-1 group-hover:text-[#C98579] transition-colors">
                          {book.title}
                        </h4>
                      </Link>
                      <Link to={`/authors/${authorSlug}`} className="text-xs text-[#6E6A67] hover:text-[#2B2B2B] transition-colors mt-0.5 block">
                        {book.author}
                      </Link>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E7D9D3]/60 flex items-center justify-between">
                      <span className="font-editorial-serif font-tabular text-base font-semibold text-[#2B2B2B]">
                        {formatPrice(book.price)}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[#6E6A67] font-tabular">
                        <Star className="w-3 h-3 text-[#D3968C] fill-[#D3968C]" />
                        <span>{book.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
