import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { MinimalBookCard } from '../../components/ui/EditorialCards';

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
    <div className="min-h-screen bg-[#F5F5DA]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E5E] hover:text-[#211D1D] transition-colors"
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
          className="space-y-4 border-b border-[#E9E5C8] pb-8"
        >
          <span className="text-xs uppercase font-mono tracking-widest text-[#212842] font-bold block">
            Genre Classification
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#211D1D] font-normal capitalize">
            {categoryTitle}
          </h1>
          <p className="text-sm text-[#6B5E5E] max-w-2xl leading-relaxed font-sans">
            {category?.desc || category?.description || `Explore our curated selection of published titles and manuscripts in the ${categoryTitle} imprint.`}
          </p>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {books.map((book, idx) => (
              <MinimalBookCard
                key={book.slug || book.id || book._id || idx}
                book={book}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
