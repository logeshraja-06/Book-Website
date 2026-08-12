import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { handleImgError, DEFAULT_AVATAR } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

export default function PublisherAuthors() {
  const { t } = useTranslation();
  const { authors = [], books = [], editorialBooks = [] } = useData();

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  return (
    <div className="space-y-8">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-[#212842]" />
            {t('publisher.authors.eyebrow')}
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-bold">
            {t('publisher.authors.title')}
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {authors.length} {t('publisher.authors.subtitleCount', { count: authors.length })}
          </p>
        </div>
      </div>

      {/* ── 2. AUTHOR REGISTRY LIST ── */}
      <div className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl border border-[#E9E5C8] divide-y divide-[#E9E5C8] shadow-md overflow-hidden">
        {authors.map((author, idx) => {
          const authorId = author._id || author.id;
          const authorTarget = author.slug || author._id || author.id;
          const authorBookCount =
            (author.books || []).length ||
            catalogSource.filter(
              (b) => b.authorId === authorId || b.authorId === author.id || b.author === author.name
            ).length;

          return (
            <motion.div
              key={author.slug || author._id || author.id || idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent hover:bg-[#F8F6E5] transition-colors group"
            >
              <Link to={`/authors/${authorTarget}`} className="flex items-center gap-4 group/author">
                <img
                  src={author.avatarUrl || DEFAULT_AVATAR}
                  alt={author.name}
                  onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E9E5C8] shadow-2xs group-hover/author:border-[#212842] transition-colors shrink-0"
                />
                <div>
                  <h4 className="font-editorial-serif text-base font-bold text-[#211D1D] group-hover/author:text-[#212842] transition-colors">
                    {author.name}
                  </h4>
                  <p className="text-xs text-[#6B5E5E] font-sans">
                    {author.role || author.genre || t('publisher.authors.contributingAuthor')} · {authorBookCount} {t('publisher.authors.publishedWorks')}
                  </p>
                </div>
              </Link>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E9E5C8]">
                <span className="text-xs font-mono text-[#6B5E5E]">
                  {author.followers || 0} {t('publisher.authors.readers')}
                </span>
                <span className="text-xs font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t('publisher.authors.active')}
                </span>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <Link
                    to={`/authors/${authorTarget}`}
                    className="font-bold uppercase tracking-wider text-[#212842] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('publisher.authors.profile')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    to={`/publisher/books?author=${author._id || author.id}`}
                    className="font-bold uppercase tracking-wider text-[#211D1D] hover:text-[#212842] transition-colors hover:underline"
                  >
                    {t('publisher.authors.catalogBooks')}
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
