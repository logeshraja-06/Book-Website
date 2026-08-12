import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  animate
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Star, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { BOOKS, FEATURED_BOOKS } from '../../data/booksData';
import { formatPrice } from '../../utils/format';
import { handleImgError, DEFAULT_BOOK_COVER } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

function StatCounter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 1.6,
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
    <span ref={ref} className="font-editorial-sans font-tabular text-lg font-bold text-[#FFFDF3] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

function FlipBookDecor({ coverUrl, className = '', delay = 0, duration = 7 }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`} style={{ perspective: '1000px' }}>
      <div
        className="relative w-full h-full hero-book-flip"
        style={{
          transformStyle: 'preserve-3d',
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
          <img src={coverUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 rounded-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #D8CFAE 0%, #B8AC82 100%)',
          }}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const { books } = useData();

  const heroBook =
    books?.find((b) => (b.slug || b.id || b._id) === 'psychology-of-money') ||
    BOOKS?.find((b) => b.id === 'psychology-of-money') ||
    FEATURED_BOOKS?.find((b) => b.id === 'psychology-of-money') ||
    books?.[0] ||
    FEATURED_BOOKS[0];

  const bookSlug = heroBook.slug || heroBook.id;

  const shelfSource = books && books.length > 0 ? books : BOOKS;
  const publishedShelf = shelfSource.filter((b) => !b.status || b.status === 'Published');
  const shelfBooks = (publishedShelf.length >= 8 ? publishedShelf : shelfSource).slice(0, 10);

  // Pick 3 distinct covers for the decorative flip-books (different from hero spotlight book)
  const decorBooks = shelfBooks.filter((b) => (b.slug || b.id) !== bookSlug).slice(0, 3);

  const sectionRef = useRef(null);
  const shelfRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 180, mass: 0.6 };
  const bookX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);
  const bookY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-7, 7]), springConfig);
  const bookRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const bookRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const badgeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);
  const badgeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.9]);
  const heroContentY = useTransform(scrollY, [0, 500], [0, 24]);

  useEffect(() => {
    if (!shelfRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.hero-shelf-item', shelfRef.current);
      gsap.fromTo(
        items,
        { y: 46, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: shelfRef.current, start: 'top 82%' },
        }
      );
    }, shelfRef);
    return () => ctx.revert();
  }, [shelfBooks.length, prefersReducedMotion]);

  const rotationFor = (idx) => {
    const pattern = [-4, 2, -2, 4, -3, 3, -2, 2, -4, 3];
    return pattern[idx % pattern.length];
  };
  const liftFor = (idx) => {
    const pattern = [0, 16, 6, 22, 2, 18, 8, 0, 14, 4];
    return pattern[idx % pattern.length];
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#181E33] flex flex-col"
    >
      {/* ═══════════════════════════════════════════════════════════
          PART A — TOP HERO: PHOTOGRAPH BACKGROUND + FLIP-BOOKS
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative min-h-[calc(100vh-5rem)] pt-2 pb-20 lg:pt-3 flex flex-col justify-center">

        {/* Background Photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=2400&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />

          {/* Layer 1: strong left-to-right protect gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(112deg, rgba(24,30,51,0.96) 0%, rgba(33,40,66,0.92) 28%, rgba(33,40,66,0.62) 52%, rgba(33,40,66,0.28) 72%, rgba(33,40,66,0.08) 100%)',
            }}
          />

          {/* Layer 2: bottom fade into navy, blends into wave/shelf below */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 55%, #181E33 100%)' }}
          />

          {/* Layer 3: soft top vignette so navbar sits comfortably */}
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{ background: 'linear-gradient(to bottom, rgba(24,30,51,0.55), transparent)' }}
          />
        </div>

        {/* Decorative Flip-Books (behind headline, blurred, low opacity) */}
        {decorBooks[0] && (
          <FlipBookDecor
            coverUrl={decorBooks[0].coverImage || decorBooks[0].coverUrl}
            className="hidden lg:block w-16 h-24 top-[14%] left-[6%] opacity-25 blur-[1px]"
            delay={0}
            duration={8}
          />
        )}
        {decorBooks[1] && (
          <FlipBookDecor
            coverUrl={decorBooks[1].coverImage || decorBooks[1].coverUrl}
            className="hidden lg:block w-14 h-20 top-[62%] left-[16%] opacity-20 blur-[1px]"
            delay={2.5}
            duration={9}
          />
        )}
        {decorBooks[2] && (
          <FlipBookDecor
            coverUrl={decorBooks[2].coverImage || decorBooks[2].coverUrl}
            className="hidden xl:block w-16 h-24 top-[10%] left-[42%] opacity-[0.14] blur-[2px]"
            delay={4.5}
            duration={10}
          />
        )}

        <motion.div
          style={{ opacity: heroOpacity, y: heroContentY }}
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-20 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* ── LEFT COLUMN: HEADLINE (light text on photo) ── */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="max-w-2xl">
                <h1 className="font-editorial-serif text-5xl sm:text-6xl lg:text-[5.25rem] xl:text-[5.75rem] tracking-[-0.025em] text-[#FFFDF3] leading-[1.04] font-normal">
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('home.hero.titleLine1')}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('home.hero.titleLine2')}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="italic font-light text-[#D8CFAE] block pt-1"
                  >
                    {t('home.hero.titleLine3')}
                  </motion.span>
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-[#E9E5C8]/85 leading-[1.75] max-w-xl font-normal font-sans"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                  <Link
                    to="/books"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#FFFDF3] text-[#181616] text-[14px] font-editorial-sans font-bold tracking-[0.04em] hover:bg-[#F5F5DA] transition-colors duration-300 shadow-lg hover:shadow-xl group min-h-[48px] w-full sm:w-auto"
                  >
                    <span>{t('home.hero.exploreBooks')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                  <a
                    href="#authors"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-[#FFFDF3] text-[14px] font-editorial-sans font-bold hover:bg-white/10 transition-all duration-300 min-h-[48px] w-full sm:w-auto border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(245,245,218,0.25)', backdropFilter: 'blur(8px)' }}
                  >
                    <Compass className="w-4 h-4 text-[#D8CFAE]" />
                    <span>{t('home.hero.meetAuthors')}</span>
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 border-t border-white/15 flex items-center gap-8 text-xs text-[#D8CFAE] font-editorial-sans"
              >
                <div>
                  <StatCounter target={12} suffix="K+" />
                  <span className="text-[#D8CFAE] font-medium">{t('home.hero.statCuratedWorks')}</span>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <StatCounter target={85} suffix="+" />
                  <span className="text-[#D8CFAE] font-medium">{t('home.hero.statGlobalEditions')}</span>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <StatCounter target={4.9} decimals={1} suffix=" ★" />
                  <span className="text-[#D8CFAE] font-medium">{t('home.hero.statReaderRating')}</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: SPOTLIGHT FLOATING BOOK (premium 3D product showcase) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-end lg:-mt-8 xl:-mt-12"
            >
              <motion.div
                style={{ x: bookX, y: bookY, rotateX: bookRotateX, rotateY: bookRotateY }}
                className="book-container relative w-full max-w-sm"
              >
                {/* 1. Ambient Light-Cast Glow Layer (Apple Product Style) */}
                <div
                  className="absolute -inset-4 rounded-3xl pointer-events-none hero-spotlight-breathe overflow-hidden"
                  style={{
                    backgroundImage: `url(${heroBook.coverImage || heroBook.coverUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(40px)',
                    zIndex: 0,
                  }}
                />

                {/* 2. Upgraded "Featured Hardcover" Badge with Animated Conic-Gradient Border */}
                <motion.div
                  style={{ x: badgeX, y: badgeY }}
                  className="absolute -top-3 -right-3 z-30 p-[1.5px] rounded-full overflow-hidden shadow-lg"
                >
                  <div
                    className="absolute inset-0 badge-rotate-glow pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, #212842 0%, #D8CFAE 40%, #FFFDF3 70%, #212842 100%)',
                    }}
                  />
                  <div className="relative px-3.5 py-1.5 rounded-full bg-[#FFFDF3]/95 backdrop-blur-md text-[10px] font-editorial-sans uppercase tracking-[0.16em] text-[#212842] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#212842] animate-pulse" />
                    <span>{t('home.hero.featuredBadge')}</span>
                  </div>
                </motion.div>

                <div className="relative z-10 space-y-4">
                  {/* 3. Spotlight Book with Gilded Edge Accent & Paper Edge Detail */}
                  <Link
                    to={`/books/${bookSlug}`}
                    className="relative block rounded-r-2xl rounded-l-sm p-[2px] bg-gradient-to-br from-[#F5F5DA]/70 via-[#E9E5C8]/40 to-[#212842]/40 shadow-2xl group cursor-pointer"
                  >
                    <div className="book-card-3d relative block aspect-[3/4] rounded-r-xl rounded-l-xs overflow-hidden bg-[#F5F5DA]">
                      <div className="book-spine-depth" />

                      {/* Floating paper page-edge detail */}
                      <div className="absolute top-3 bottom-3 right-1.5 z-20 flex flex-col justify-between pointer-events-none opacity-40 space-y-1">
                        <div className="w-[2px] h-full bg-[#FFFDF3] rounded-full shadow-xs" />
                        <div className="w-[2px] h-[85%] bg-[#F5F5DA] rounded-full shadow-xs" />
                        <div className="w-[2px] h-[70%] bg-[#FFFDF3] rounded-full shadow-xs" />
                      </div>

                      <img
                        src={heroBook.coverImage || heroBook.coverUrl}
                        alt={heroBook.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/75 via-transparent to-transparent opacity-85 pointer-events-none" />

                      <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)',
                          animation: 'heroShimmerSheen 1.1s ease-in-out',
                        }}
                      />

                      <div className="absolute bottom-5 left-5 right-5 text-[#F5F5DA] pointer-events-none">
                        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#E9E5C8] block mb-1 font-semibold">
                          {heroBook.genre}
                        </span>
                        <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                          {heroBook.title}
                        </h3>
                      </div>
                    </div>
                  </Link>

                  {/* 4. Upgraded Price/Rating Info Card with Dark Glass-Morphism & Light Text Tones */}
                  <div
                    className="relative bg-[#0F1424]/55 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between overflow-hidden"
                    style={{
                      boxShadow: '0 24px 48px -12px rgba(15,20,36,0.5), 0 2px 6px -1px rgba(15,20,36,0.3)',
                    }}
                  >
                    {/* Top 1px inner highlight line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
                      }}
                    />
                    <div>
                      <p className="text-xs font-sans text-[#E9E5C8]/80">By <span className="font-semibold text-[#F5F5DA]">{heroBook.author}</span></p>
                      <p className="font-editorial-sans font-tabular text-lg font-bold tracking-tight text-[#F5F5DA] mt-0.5">
                        {formatPrice(heroBook.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#F5F5DA] text-xs font-editorial-sans font-bold font-tabular shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-[#D8CFAE] text-[#D8CFAE]" />
                        <span>{heroBook.rating} ({heroBook.reviewsCount})</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PART B — WAVE DIVIDER (unchanged from previous task)
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 -mb-1" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full h-[70px] sm:h-[100px] lg:h-[130px] block">
          <path
            d="M0,64 C240,120 480,10 720,48 C960,86 1200,20 1440,60 L1440,140 L0,140 Z"
            fill="#181E33"
          />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PART C — BOOKSHELF PANORAMA (unchanged from previous task)
         ═══════════════════════════════════════════════════════════ */}
      <div
        ref={shelfRef}
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #181E33 0%, #212842 55%, #2A3358 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none select-none">
          <div
            className="absolute top-10 left-[10%] w-[420px] h-[420px] rounded-full hero-ambient-pulse"
            style={{ background: 'radial-gradient(circle, rgba(216,207,174,0.14) 0%, rgba(216,207,174,0) 70%)' }}
          />
          <div
            className="absolute bottom-0 right-[8%] w-[380px] h-[380px] rounded-full hero-ambient-pulse"
            style={{ background: 'radial-gradient(circle, rgba(245,245,218,0.10) 0%, rgba(245,245,218,0) 70%)', animationDelay: '3s' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-2 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10 sm:mb-14 flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#D8CFAE]" />
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#D8CFAE] font-bold">
                {t('home.hero.shelfLabel')}
              </span>
            </div>
            <span className="text-xs font-mono text-[#F5F5DA]/60">
              {shelfBooks.length} {t('home.hero.shelfCountSuffix')}
            </span>
          </motion.div>

          <div className="flex items-end gap-5 sm:gap-7 overflow-x-auto pb-2 scrollbar-hide" style={{ perspective: '1600px' }}>
            {shelfBooks.map((book, idx) => {
              const slug = book.slug || book.id || book._id;
              const rotate = rotationFor(idx);
              const lift = liftFor(idx);
              return (
                <div key={`${slug || 'hero-shelf'}-${idx}`} className="hero-shelf-item shrink-0" style={{ marginBottom: `${lift}px` }}>
                  <Link
                    to={`/books/${slug}`}
                    className="hero-shelf-book hero-float-slow block relative"
                    style={{ transform: `rotate(${rotate}deg)`, animationDelay: `${idx * 0.4}s` }}
                  >
                    <div className="w-24 sm:w-28 lg:w-32 aspect-[2/3] rounded-r-lg rounded-l-sm overflow-hidden shadow-2xl border border-[#F5F5DA]/10 bg-[#211D1D]">
                      <img
                        src={book.coverImage || book.coverUrl || DEFAULT_BOOK_COVER}
                        alt={book.title}
                        onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="w-24 sm:w-28 lg:w-32 aspect-[2/3] rounded-r-lg rounded-l-sm overflow-hidden mt-1 opacity-25"
                      style={{
                        transform: 'scaleY(-1)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)',
                      }}
                    >
                      <img
                        src={book.coverImage || book.coverUrl || DEFAULT_BOOK_COVER}
                        alt=""
                        onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(216,207,174,0.5) 20%, rgba(216,207,174,0.5) 80%, transparent 100%)' }}
          />
        </div>
      </div>
    </section>
  );
}
