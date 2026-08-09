import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate
} from 'framer-motion';
import { ArrowRight, Sparkles, Star, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { BOOKS, FEATURED_BOOKS } from '../../data/booksData';
import { formatPrice } from '../../utils/format';

function StatCounter({ target, prefix = '', suffix = '', decimals = 0, staticDisplay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (staticDisplay) return;
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
  }, [isInView, target, decimals, motionVal, staticDisplay]);

  if (staticDisplay) {
    return (
      <span className="font-editorial-sans font-tabular text-lg font-bold text-[#211D1D] block tracking-tight">
        {staticDisplay}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-editorial-sans font-tabular text-lg font-bold text-[#211D1D] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const { books } = useData();

  // Featured Hero Book: "The Psychology of Money"
  const heroBook =
    books?.find((b) => (b.slug || b.id || b._id) === 'psychology-of-money') ||
    BOOKS?.find((b) => b.id === 'psychology-of-money') ||
    FEATURED_BOOKS?.find((b) => b.id === 'psychology-of-money') ||
    FEATURED_BOOKS[0];

  const bookSlug = heroBook.slug || heroBook.id;
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Programmatic Video Lifecycle & Playback Management (Cross-device, Desktop & Mobile)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicit JS property assignment (Strict compliance for Safari/Chrome autoplay & iOS playsInline)
    video.muted = true;
    video.playsInline = true;

    const logDiagnostics = (eventTag, customErr = null) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[HeroVideo ${eventTag}]`, {
          src: video.currentSrc || '/hero-bg.mp4',
          readyState: video.readyState,
          networkState: video.networkState,
          paused: video.paused,
          muted: video.muted,
          autoplay: video.autoplay,
          duration: video.duration,
          currentTime: video.currentTime,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          error: customErr || (video.error ? video.error.message || video.error.code : null),
        });
      }
    };

    const handlePlaying = () => {
      setIsVideoPlaying(true);
      setIsVideoLoaded(true);
      logDiagnostics('playing');
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      logDiagnostics('loadeddata');
    };

    const handleError = (e) => {
      logDiagnostics('error', e);
      setIsVideoPlaying(false);
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleLoadedData);
    video.addEventListener('error', handleError);

    // Initial Load & Play Attempt with graceful Promise handling
    video.load();
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
          setIsVideoLoaded(true);
          logDiagnostics('playPromiseResolved');
        })
        .catch((err) => {
          logDiagnostics('playPromiseRejected', err.message);
          // Retry muted playback once if initial trigger was throttled
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => {
                setIsVideoPlaying(true);
                setIsVideoLoaded(true);
              }).catch(() => {});
            }
          }, 350);
        });
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MOUSE CURSOR PARALLAX (Subtle spring physics: 1-2px bg, 4-8px book) ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 180, mass: 0.6 };
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-2, 2]), springConfig);

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

  // ── 2. SCROLL TRANSITION (Cinematic fade and subtle vertical parallax) ──
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.9]);
  const heroContentY = useTransform(scrollY, [0, 500], [0, 24]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden min-h-[calc(100vh-5rem)] pt-2 pb-16 lg:pt-3 lg:pb-24 bg-[#F5F5DA] flex flex-col justify-center"
    >
      {/* ── 1. CINEMATIC FULL HERO BACKGROUND VIDEO LAYER ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <motion.div
          style={{ x: bgX, y: bgY }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 28,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-full h-full z-0"
        >
          {/* High-End HTML5 Background Video (Full Hero Background Layer) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-in-out opacity-90 sm:opacity-95"
            style={{
              objectPosition: 'center center',
              filter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
            }}
          >
            <source src="/hero-bg.mp4?v=1" type="video/mp4" />
          </video>
        </motion.div>

        {/* ── 2. EDITORIAL OVERLAY & RADIAL VIGNETTE LAYER (z-10) ── */}
        {/* Soft Radial Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(33,29,29,0.08) 100%)',
          }}
        />

        {/* Text Readability Gradient Overlay (Translucent Ivory protecting text on left while keeping background book crisp) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#F5F5DA]/85 via-[#F5F5DA]/40 to-transparent pointer-events-none" />

        {/* Subtle Crimson Ambient Accent Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#212842]/[0.03] via-transparent to-transparent pointer-events-none" />

        {/* Subtle Bottom Darkening Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-36 z-10 bg-gradient-to-t from-[#F5F5DA] via-[#F5F5DA]/60 to-transparent pointer-events-none" />
      </div>

      {/* ── 3. AMBIENT GLOW BLOBS ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[760px] h-[440px] bg-gradient-to-tr from-[#212842]/[0.04] via-[#E9E5C8]/25 to-transparent blur-3xl rounded-full pointer-events-none z-10" />

      {/* ── 4. HERO CONTENT LAYER (z-20) ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroContentY }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── LEFT COLUMN: EDITORIAL HEADLINE & STORYTELLING ── */}
          <div className="lg:col-span-7 space-y-8 text-left">

            {/* 1. Large Editorial Headline in Cormorant Garamond */}
            <div className="max-w-2xl">
              <h1 className="font-editorial-serif text-5xl sm:text-6xl lg:text-[5.25rem] xl:text-[5.75rem] tracking-[-0.025em] text-[#211D1D] leading-[1.04] font-normal">
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  Stories worth
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  reading.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="italic font-light text-[#212842] block pt-1"
                >
                  Books worth remembering.
                </motion.span>
              </h1>
            </div>

            {/* 3. Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#6B5E5E] leading-[1.75] max-w-xl font-normal font-sans"
            >
              BookVerse Studio is an interconnected ecosystem where authors craft enduring manuscripts, independent publishers curate authoritative imprints, and discerning readers discover literary treasures.
            </motion.p>

            {/* 4. CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-[14px] font-editorial-sans font-bold tracking-[0.04em] hover:bg-[#181E33] transition-colors duration-300 shadow-md hover:shadow-lg group min-h-[48px] w-full sm:w-auto"
                >
                  <span>Explore Books</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <a
                  href="#authors"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] text-[14px] font-editorial-sans font-bold hover:border-[#212842] hover:bg-[#F5F5DA] transition-all duration-300 min-h-[48px] w-full sm:w-auto shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#6B5E5E]" />
                  <span>Meet the Authors</span>
                </a>
              </motion.div>
            </motion.div>

            {/* 5. Editorial Credibility Metadata Line */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 border-t border-[#E9E5C8] flex items-center gap-8 text-xs text-[#6B5E5E] font-editorial-sans"
            >
              <div>
                <StatCounter target={12} suffix="K+" />
                <span className="text-[#6B5E5E] font-medium">Curated Works</span>
              </div>
              <div className="h-8 w-px bg-[#E9E5C8]" />
              <div>
                <StatCounter target={85} suffix="+" />
                <span className="text-[#6B5E5E] font-medium">Global Editions</span>
              </div>
              <div className="h-8 w-px bg-[#E9E5C8]" />
              <div>
                <StatCounter target={4.9} decimals={1} suffix=" ★" />
                <span className="text-[#6B5E5E] font-medium">Reader Rating</span>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN: 3D FLOATING BOOK SHOWCASE WITH PARALLAX ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end lg:-mt-8 xl:-mt-12"
          >
            <motion.div
              style={{
                x: bookX,
                y: bookY,
                rotateX: bookRotateX,
                rotateY: bookRotateY,
              }}
              className="book-container relative w-full max-w-sm"
            >
              {/* Floating Badge */}
              <motion.div
                style={{ x: badgeX, y: badgeY }}
                animate={{
                  boxShadow: [
                    '0 4px 14px -2px rgba(33,29,29,0.08)',
                    '0 10px 28px -4px rgba(123,2,29,0.22)',
                    '0 4px 14px -2px rgba(33,29,29,0.08)'
                  ]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 z-30 px-3.5 py-1.5 rounded-full bg-[#FFFDF3]/90 backdrop-blur-md border border-[#E9E5C8] text-[10px] font-editorial-sans uppercase tracking-[0.16em] text-[#212842] font-bold shadow-md flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#212842] animate-pulse" />
                <span>Featured Hardcover</span>
              </motion.div>

              {/* Physical 3D Hardcover Book Object */}
              <div className="space-y-4">
                <Link
                  to={`/books/${bookSlug}`}
                  className="book-card-3d relative block aspect-[3/4] rounded-r-2xl rounded-l-sm overflow-hidden bg-[#F5F5DA] border border-[#E9E5C8]/80 shadow-2xl group cursor-pointer"
                >
                  <div className="book-spine-depth" />
                  <img
                    src={heroBook.coverImage || heroBook.coverUrl}
                    alt={heroBook.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/75 via-transparent to-transparent opacity-85 pointer-events-none" />

                  <div className="absolute bottom-5 left-5 right-5 text-[#F5F5DA] pointer-events-none">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#E9E5C8] block mb-1 font-semibold">
                      {heroBook.genre}
                    </span>
                    <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                      {heroBook.title}
                    </h3>
                  </div>
                </Link>

                {/* Floating Glass Metadata Badge */}
                <div className="bg-[#FFFDF3]/90 backdrop-blur-md border border-[#E9E5C8] rounded-2xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-sans text-[#6B5E5E]">By <span className="font-semibold text-[#211D1D]">{heroBook.author}</span></p>
                    <p className="font-editorial-sans font-tabular text-lg font-bold tracking-tight text-[#211D1D] mt-0.5">
                      {formatPrice(heroBook.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#212842] text-xs font-editorial-sans font-bold font-tabular">
                      <Star className="w-3.5 h-3.5 fill-[#212842]" />
                      <span>{heroBook.rating} ({heroBook.reviewsCount})</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
