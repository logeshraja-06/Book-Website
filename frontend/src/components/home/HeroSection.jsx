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
import { FEATURED_BOOKS } from '../../data/mockData';
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
      <span className="font-editorial-sans font-tabular text-lg font-bold text-[#2B2B2B] block tracking-tight">
        {staticDisplay}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-editorial-sans font-tabular text-lg font-bold text-[#2B2B2B] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const heroBook = FEATURED_BOOKS[0]; // Ponniyin Selvan
  const bookSlug = heroBook.slug || heroBook.id;
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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
      className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-[#F5F5DA]"
    >
      {/* ── 1. VIDEO LAYER + STATIC FALLBACK LAYER ── */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none select-none">
        <motion.div
          style={{ x: bgX, y: bgY }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Video (Autoplay, Loop, Muted, PlaysInline) */}
          {!prefersReducedMotion && !videoError && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onCanPlayThrough={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-[0.14]' : 'opacity-0'
              }`}
              style={{
                filter: 'grayscale(40%) contrast(1.15) brightness(1.02)',
              }}
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-hands-turning-the-pages-of-a-book-43407-large.mp4"
                type="video/mp4"
              />
            </video>
          )}

          {/* Static High-Resolution Fallback Image */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-0' : 'opacity-[0.12]'
            }`}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2400&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              filter: 'grayscale(30%) contrast(1.1)',
            }}
          />
        </motion.div>

        {/* ── 2. OVERLAY LAYER (Warm Ivory Cream + Radial Vignette for Contrast) ── */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#F5F5DA]/60 via-[#F5F5DA]/20 to-[#F5F5DA]"
          style={{
            maskImage:
              'radial-gradient(ellipse 85% 65% at 50% 35%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 65% at 50% 35%, black 30%, transparent 80%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F5F5DA] to-transparent" />
      </div>

      {/* ── 3. AMBIENT GLOW BLOBS (Quiet Luxury Soft Tonality) ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[760px] h-[440px] bg-gradient-to-tr from-[#7B021D]/[0.08] via-[#E9E5C8]/40 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      {/* ── 4. HERO CONTENT LAYER ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroContentY }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── LEFT COLUMN: EDITORIAL HEADLINE & STORYTELLING ── */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* 1. Small Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#7B021D] text-[11px] font-editorial-sans uppercase tracking-[0.18em] shadow-2xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7B021D]" />
              <span>The Digital Publishing Studio</span>
            </motion.div>

            {/* 2. Large Editorial Headline in Cormorant Garamond */}
            <div className="max-w-2xl">
              <h1 className="font-editorial-serif text-5xl sm:text-6xl lg:text-[5.25rem] xl:text-[5.75rem] tracking-[-0.025em] text-[#211D1D] leading-[1.04] font-normal">
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  Stories worth
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  reading.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="italic font-light text-[#7B021D] block pt-1"
                >
                  Books worth remembering.
                </motion.span>
              </h1>
            </div>

            {/* 3. Supporting Description in Inter */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#6B5E5E] leading-[1.75] max-w-xl font-normal font-sans"
            >
              BookVerse Studio is an interconnected ecosystem where authors craft enduring manuscripts, independent publishers curate authoritative imprints, and discerning readers discover literary treasures.
            </motion.p>

            {/* 4. CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-[14px] font-editorial-sans font-semibold tracking-[0.04em] hover:bg-[#520014] transition-colors duration-300 shadow-md hover:shadow-lg group min-h-[48px] w-full sm:w-auto"
                >
                  <span>Explore Books</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <a
                  href="#authors"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] text-[14px] font-editorial-sans font-medium hover:border-[#7B021D] hover:bg-[#F5F5DA] transition-all duration-300 min-h-[48px] w-full sm:w-auto shadow-2xs"
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
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
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
              {/* Floating Badge with Soft Drop-Shadow Pulse */}
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
                className="absolute -top-3 -right-3 z-30 px-3.5 py-1.5 rounded-full bg-[#FFFDF3]/95 backdrop-blur-md border border-[#E9E5C8] text-[10px] font-editorial-sans uppercase tracking-[0.16em] text-[#7B021D] font-bold shadow-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B021D] animate-pulse" />
                <span>Featured Hardcover</span>
              </motion.div>

              {/* Physical 3D Book Object */}
              <Link
                to={`/books/${bookSlug}`}
                className="book-card-3d relative rounded-2xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8] p-5 shadow-2xl block group cursor-pointer"
              >
                <div className="book-spine-depth" />
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner bg-[#F5F5DA] mb-4">
                  <img 
                    src={heroBook.coverImage || heroBook.coverUrl} 
                    alt={heroBook.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211D1D]/75 via-transparent to-transparent opacity-85" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-[#F5F5DA]">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#E9E5C8] block mb-1 font-semibold">
                      {heroBook.genre}
                    </span>
                    <h3 className="font-editorial-serif text-2xl font-bold leading-tight tracking-tight">
                      {heroBook.title}
                    </h3>
                  </div>
                </div>

                {/* Meta details with Cormorant Garamond + Inter + Montserrat tabular price */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[13px] font-sans text-[#6B5E5E]">By {heroBook.author}</p>
                    <p className="font-editorial-sans font-tabular text-[17px] font-bold tracking-tight text-[#211D1D] mt-0.5">
                      {formatPrice(heroBook.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#7B021D] text-xs font-editorial-sans font-bold font-tabular">
                      {heroBook.rating} ★ ({heroBook.reviewsCount})
                    </span>
                  </div>
                </div>

              </Link>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
