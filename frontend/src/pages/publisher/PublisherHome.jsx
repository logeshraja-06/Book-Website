import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { Layers, ArrowRight, BookOpen, Clock, ShieldCheck, Tag, Sparkles, BookCheck, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { handleImgError, DEFAULT_BOOK_COVER } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

function StatCounter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (decimals > 0) {
            setDisplayValue(latest.toFixed(decimals));
          } else {
            setDisplayValue(Math.floor(latest).toLocaleString('en-IN'));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, decimals, motionVal]);

  return (
    <span ref={ref} className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#211D1D] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function PublisherHome() {
  const { t } = useTranslation();
  const { books = [], editorialBooks = [], editorialQueue = [], categories = [], authors = [] } = useData();

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  const pendingCount = editorialQueue.length > 0 ? editorialQueue.length : catalogSource.filter((b) => b.status === 'In Review').length;
  const approvedCount = catalogSource.filter((b) => b.status === 'Published').length;
  const totalCategories = categories.length || 8;
  const totalAuthorsCount = authors.length || 12;

  const recentSubmissions = editorialQueue.length > 0 ? editorialQueue.slice(0, 4) : catalogSource.slice(0, 4);

  return (
    <div className="space-y-10">
      
      {/* ── 1. HEADER & ACCENT BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
            {t('publisher.home.eyebrow')}
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#211D1D] font-bold">
            {t('publisher.home.title')}
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {t('publisher.home.subtitle')}
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/publisher/categories"
              className="px-5 py-2.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] text-xs font-bold uppercase tracking-wider hover:border-[#212842] transition-colors shadow-2xs block"
            >
              {t('publisher.home.taxonomyCategories')}
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/publisher/queue"
              className="px-6 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md block"
            >
              {t('publisher.home.reviewQueue')} ({pendingCount})
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── 2. COUNT-UP STAT CARDS (Subtle Gradient Surfaces + Glow) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold">
              {t('publisher.home.statPendingReviews')}
            </span>
            <Clock className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={pendingCount} />
          <span className="text-[11px] text-[#6B5E5E] font-sans block">{t('publisher.home.statPendingReviewsSub')}</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold">
              {t('publisher.home.statPublishedWorks')}
            </span>
            <BookCheck className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={approvedCount} />
          <span className="text-[11px] text-[#6B5E5E] font-sans block">{t('publisher.home.statPublishedWorksSub')}</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold">
              {t('publisher.home.statActiveCategories')}
            </span>
            <Tag className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={totalCategories} />
          <span className="text-[11px] text-[#6B5E5E] font-sans block">{t('publisher.home.statActiveCategoriesSub')}</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold">
              {t('publisher.home.statAuthorGuild')}
            </span>
            <Users className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={totalAuthorsCount} />
          <span className="text-[11px] text-[#6B5E5E] font-sans block">{t('publisher.home.statAuthorGuildSub')}</span>
        </motion.div>
      </div>

      {/* ── 3. RECENT ACTIVITY & CONTROL PROTOCOL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Submissions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-3">
            <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
              {t('publisher.home.recentSubmissions')}
            </h3>
            <Link
              to="/publisher/queue"
              className="text-xs font-mono text-[#212842] hover:underline inline-flex items-center gap-1 font-bold"
            >
              <span>{t('publisher.home.viewFullQueue')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentSubmissions.map((book, idx) => (
              <motion.div
                key={book.id || book._id || `recent-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="bg-gradient-to-r from-[#FFFDF3] to-[#F5F5DA] rounded-2xl p-4 border border-[#E9E5C8] flex items-center justify-between gap-4 hover:border-[#212842] shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-14 rounded overflow-hidden bg-[#F5F5DA] shrink-0 border border-[#E9E5C8] shadow-2xs">
                    <img
                      src={book.coverImage || book.coverUrl || DEFAULT_BOOK_COVER}
                      alt={book.title}
                      onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="font-editorial-serif text-base font-bold text-[#211D1D] group-hover:text-[#212842] transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#6B5E5E] font-sans">By {book.author} · {book.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#212842] px-2.5 py-1 rounded-full bg-[#FFFDF3] border border-[#E9E5C8]">
                    {book.status}
                  </span>
                  <Link
                    to={`/publisher/review/${book.id || book._id}`}
                    className="text-xs font-bold uppercase font-mono text-[#211D1D] hover:text-[#212842] transition-colors"
                  >
                    {t('publisher.home.review')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Protocol Guidance */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md space-y-4">
            <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#212842]" />
              {t('publisher.home.protocolTitle')}
            </h3>
            <p className="text-xs text-[#6B5E5E] leading-relaxed font-sans">
              {t('publisher.home.protocolDesc')}
            </p>

            <div className="pt-2 border-t border-[#E9E5C8] space-y-2">
              <Link
                to="/publisher/queue"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#FFFDF3] hover:bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-mono text-[#211D1D] font-bold transition-colors group"
              >
                <span>{t('publisher.home.manuscriptReviewDesk')}</span>
                <ArrowRight className="w-4 h-4 text-[#212842] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/publisher/reports"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#FFFDF3] hover:bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-mono text-[#211D1D] font-bold transition-colors group"
              >
                <span>{t('publisher.home.analyticsReports')}</span>
                <ArrowRight className="w-4 h-4 text-[#212842] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
