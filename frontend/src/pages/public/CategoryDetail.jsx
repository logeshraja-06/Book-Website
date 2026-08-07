import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';

export default function CategoryDetail() {
  const { slug } = useParams();
  const [data, setData] = useState({ category: null, books: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchCategoryBooks() {
      setLoading(true);
      try {
        const res = await apiFetch(`/categories/${slug}/books`);
        if (isMounted && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load category books:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCategoryBooks();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const { category, books } = data;
  const categoryTitle = category?.name || slug?.replace(/-/g, ' ') || 'Category';

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>
      </div>

      {/* Category Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 border-b border-[#E7D9D3] pb-8"
        >
          <span className="text-xs uppercase font-mono tracking-widest text-[#D3968C] font-semibold block">
            Curated Imprint Genre
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] font-normal capitalize">
            {categoryTitle}
          </h1>
          <p className="text-sm text-[#6E6A67] max-w-2xl leading-relaxed">
            {category?.desc || `Explore premium published works in the ${categoryTitle} collection.`}
          </p>
          <span className="text-xs font-mono text-[#6E6A67] block">
            {loading ? 'Checking catalog…' : `${books.length} Published Titles in Catalog`}
          </span>
        </motion.div>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} type="book" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Titles in this Category Yet"
            description="Our editorial board is reviewing upcoming manuscripts for this category. Check back soon!"
            actionText="Explore All Books"
            actionLink="/books"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => {
              const bookSlug = book.slug || book.id || book._id;
              const authorSlug = book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
              return (
                <motion.div
                  key={bookSlug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] flex flex-col justify-between hover:border-[#D3968C] transition-all duration-300 group shadow-sm h-full"
                >
                  <div>
                    <Link to={`/books/${bookSlug}`} className="block aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] mb-4">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
                      {book.genre}
                    </span>

                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] line-clamp-1 mt-1 group-hover:text-[#C98579] transition-colors">
                        {book.title}
                      </h3>
                    </Link>

                    <Link to={`/authors/${authorSlug}`} className="text-xs text-[#6E6A67] hover:text-[#2B2B2B] mt-1 block">
                      By {book.author}
                    </Link>

                    <p className="text-xs text-[#6E6A67] mt-2 line-clamp-2 italic">
                      "{book.synopsis}"
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                    <span className="font-editorial-serif text-base font-bold text-[#2B2B2B]">
                      {formatPrice(book.price)}
                    </span>
                    <Link
                      to={`/books/${bookSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
