import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ArrowUpRight, CheckCircle2, Award, Globe, Feather } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';

export default function AuthorProfile() {
  const { id: slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAuthor() {
      setLoading(true);
      try {
        const res = await apiFetch(`/authors/${slug}`);
        if (isMounted && res.data) {
          setAuthor(res.data);
        }
      } catch (err) {
        console.error('Failed to load author profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAuthor();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <SkeletonCard type="detail" />
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] py-20">
        <EmptyState
          icon={BookOpen}
          title="Author Profile Not Found"
          description="The requested author profile does not exist in our catalog registry."
          actionText="Back to Author Directory"
          actionLink="/authors"
        />
      </div>
    );
  }

  const books = author.authorBooks || author.books || [];

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          to="/authors"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Author Index</span>
        </Link>
      </div>

      {/* Author Bio Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Author Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFFFFF] bg-[#F4EEEA]">
              <img
                src={author.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt={author.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-[#FAF8F6]">
                <span className="px-3 py-1 rounded-full bg-[#FFFFFF]/20 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-[#FAF8F6] border border-[#FFFFFF]/30 inline-block mb-2">
                  Verified Literary Byline
                </span>
                <p className="text-xs font-mono text-[#E8C8C2]">
                  {author.name} · {author.joinDate || 'BookVerse Contributor'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Details & Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D3968C] font-semibold block">
                {author.role || 'Published Author'}
              </span>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2B2B] font-normal tracking-tight">
                {author.name}
              </h1>
            </div>

            {/* Metrics Ribbon */}
            <div className="py-4 border-y border-[#E7D9D3] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono font-tabular text-[#6E6A67]">
              <span>
                <strong className="text-[#2B2B2B] font-semibold">{books.length}</strong> Works in Catalog
              </span>
              <span className="text-[#E7D9D3]">·</span>
              <span>
                <strong className="text-[#2B2B2B] font-semibold">{author.avgRating || '4.8 ★'}</strong> Average Rating
              </span>
              <span className="text-[#E7D9D3]">·</span>
              <span>
                <strong className="text-[#2B2B2B] font-semibold">{author.stats?.totalReads || '120k'}</strong> Total Reads
              </span>
            </div>

            <blockquote className="font-editorial-serif text-xl sm:text-2xl italic text-[#2B2B2B] leading-relaxed border-l-2 border-[#D3968C] pl-6">
              "{author.bio}"
            </blockquote>

            {author.fullBio && (
              <p className="text-sm text-[#6E6A67] leading-relaxed">
                {author.fullBio}
              </p>
            )}

            {/* Genres Tag Cloud */}
            {author.genres && author.genres.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67] block">
                  Literary Specialties
                </span>
                <div className="flex flex-wrap gap-2">
                  {author.genres.map((g, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social & Connect Links */}
            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#6E6A67]">
              <span className="uppercase tracking-wider text-[10px]">Links:</span>
              <a href={author.socialLinks?.website || '#'} className="hover:text-[#2B2B2B] transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#D3968C]" />
                <span>Official Archive</span>
              </a>
              <span>·</span>
              <a href={author.socialLinks?.twitter || '#'} className="hover:text-[#2B2B2B] transition-colors flex items-center gap-1">
                <Feather className="w-3.5 h-3.5 text-[#D3968C]" />
                <span>{author.handle || '@author'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author Bibliography Grid */}
      <section className="py-16 bg-[#F4EEEA] border-t border-[#E7D9D3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-1">
                Catalog Bibliography
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal">
                Published Titles by {author.name}
              </h2>
            </div>
            <p className="text-xs text-[#6E6A67] font-mono">
              Showing {books.length} title(s) in BookVerse Studio
            </p>
          </div>

          {books.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-2xl p-8 text-center text-xs font-mono text-[#6E6A67] border border-[#E7D9D3]">
              No published titles in the catalog yet for this author.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => {
                const bookSlug = book.slug || book.id || book._id;
                const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
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

                      <Link to={`/categories/${categorySlug}`} className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67] hover:text-[#D3968C] transition-colors">
                        {book.genre}
                      </Link>

                      <Link to={`/books/${bookSlug}`}>
                        <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] line-clamp-1 mt-1 group-hover:text-[#C98579] transition-colors">
                          {book.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#6E6A67] mt-1 line-clamp-2 italic">
                        "{book.synopsis}"
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                      <span className="font-editorial-serif font-tabular text-base font-bold text-[#2B2B2B]">
                        {formatPrice(book.price)}
                      </span>
                      <Link
                        to={`/books/${bookSlug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
