import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ArrowUpRight, Share2, Feather, Star } from 'lucide-react';
import { getAuthorById } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/book/BookCover';
import { AuthorBookCard } from '../../components/book/BookCardComponents';
import { handleImgError, DEFAULT_AVATAR } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

export default function AuthorProfile() {
  const { t } = useTranslation();
  const { id: slug } = useParams();
  const { authors = [], books: allCatalogBooks = [], loading } = useData();

  // Find author by slug or id or name slug
  const author =
    authors.find(
      (a) =>
        a.slug === slug ||
        a.id === slug ||
        a._id === slug ||
        a.name?.toLowerCase().replace(/\s+/g, '-') === slug
    ) || getAuthorById(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DA] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SkeletonCard type="detail" />
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-[#F5F5DA] py-20">
        <EmptyState
          icon={BookOpen}
          title={t('detail.author.notFoundTitle')}
          description={t('detail.author.notFoundDesc')}
          actionText={t('detail.author.backToDirectory')}
          actionLink="/authors"
        />
      </div>
    );
  }

  const books =
    author.authorBooks ||
    author.books ||
    allCatalogBooks.filter(
      (b) =>
        b.authorId === author.id ||
        (b.author && b.author.toLowerCase().includes(author.name?.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          to="/authors"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E5E] hover:text-[#211D1D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.author.backToIndex')}</span>
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
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFFDF3] bg-[#FFFDF3]">
              <img
                src={author.avatarUrl || DEFAULT_AVATAR}
                alt={author.name}
                onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-[#F5F5DA]">
                <span className="px-3 py-1 rounded-full bg-[#FFFDF3]/25 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-[#F5F5DA] border border-[#FFFDF3]/30 inline-block mb-2 font-bold">
                  {t('detail.author.verifiedByline')}
                </span>
                <p className="text-xs font-mono text-[#E9E5C8]">
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
              <span className="text-xs font-mono uppercase tracking-widest text-[#212842] font-bold block">
                {author.role || 'Published Author'}
              </span>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#211D1D] font-normal tracking-tight">
                {author.name}
              </h1>
            </div>

            {/* Metrics Ribbon */}
            <div className="py-4 border-y border-[#E9E5C8] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono font-tabular text-[#6B5E5E]">
              <span>
                <strong className="text-[#211D1D] font-bold">{books.length}</strong> {t('detail.author.worksInCatalog')}
              </span>
              <span className="text-[#E9E5C8]">·</span>
              <span>
                <strong className="text-[#211D1D] font-bold">{author.avgRating || '4.8 ★'}</strong> {t('detail.author.averageRating')}
              </span>
              <span className="text-[#E9E5C8]">·</span>
              <span>
                <strong className="text-[#211D1D] font-bold">{author.stats?.totalReads || '120k'}</strong> {t('detail.author.totalReads')}
              </span>
            </div>

            <blockquote className="font-editorial-serif text-xl sm:text-2xl italic text-[#211D1D] leading-relaxed border-l-2 border-[#212842] pl-6">
              "{author.bio}"
            </blockquote>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={`/books`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-sm"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>{t('detail.author.exploreWorks')} ({books.length})</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author Catalog Grid */}
      <section className="py-16 border-t border-[#E9E5C8] bg-[#F5F5DA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-1">
                {t('detail.author.bibliographyEyebrow')}
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#211D1D] font-normal">
                {t('detail.author.publishedTitlesBy')} {author.name}
              </h2>
            </div>
            <p className="text-xs text-[#6B5E5E] font-mono">
              {t('detail.author.showingTitles')} {books.length} {t('detail.author.titlesInPlatform')}
            </p>
          </div>

          {books.length === 0 ? (
            <div className="bg-[#FFFDF3] rounded-2xl p-8 text-center text-xs font-mono text-[#6B5E5E] border border-[#E9E5C8]">
              {t('detail.author.noPublishedTitles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book, idx) => (
                <AuthorBookCard
                  key={`${book.slug || book.id || book._id || 'author-bk'}-${idx}`}
                  book={book}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
