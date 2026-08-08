import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
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
        duration: 1.8,
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
      <span className="font-tabular font-editorial-sans text-lg font-bold text-[#2B2B2B] block">
        {staticDisplay}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-tabular font-editorial-sans text-lg font-bold text-[#2B2B2B] block">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const heroBook = FEATURED_BOOKS[0]; // Ponniyin Selvan
  const bookSlug = heroBook.slug || heroBook.id;

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-[#FAF8F6]">
      
      {/* Cinematic Background Image Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2400&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.14,
            filter: 'grayscale(20%) contrast(1.1)',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)',
          }}
        />
        {/* Solid fade to background color at edges so image never looks "pasted" */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F6]/40 via-transparent to-[#FAF8F6]" />
      </div>

      {/* 2. Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-gradient-to-tr from-[#E8C8C2]/30 via-[#F4EEEA]/50 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      {/* 3. Hero Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Staggered Blur Reveal */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#6E6A67] text-xs font-mono uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Digital Publishing Platform</span>
            </motion.div>

            {/* Main Editorial Headline with Staggered 2-Line Blur Reveal */}
            <div className="max-w-2xl">
              <h1 className="font-editorial-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#2B2B2B] leading-[1.08] font-normal">
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 18 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  Where stories find their
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 18 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="italic font-light text-[#C98579] block"
                >
                  eternal form.
                </motion.span>
              </h1>
            </div>

            {/* Sub-Headline Copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#6E6A67] leading-relaxed max-w-xl font-normal"
            >
              BookVerse Studio is an interconnected ecosystem designed for authors to craft manuscripts, independent publishers to curate catalogs, and readers to discover literary treasures.
            </motion.p>

            {/* CTAs with Tactile Hover Lift */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-sm font-semibold tracking-wide hover:bg-[#D3968C] transition-colors duration-300 shadow-md hover:shadow-lg group min-h-[44px] w-full sm:w-auto"
                >
                  <span>Explore Books</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <a
                  href="#authors"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#2B2B2B] text-sm font-medium hover:border-[#D3968C] hover:bg-[#FAF8F6] transition-all duration-300 min-h-[44px] w-full sm:w-auto"
                >
                  <Compass className="w-4 h-4 text-[#6E6A67]" />
                  <span>Meet Our Authors</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Micro Credibility Line with Animated Numeric Counters */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 border-t border-[#E7D9D3]/60 flex items-center gap-8 text-xs text-[#6E6A67]"
            >
              <div>
                <StatCounter target={4200} suffix="+" />
                <span>Curated Manuscripts</span>
              </div>
              <div className="h-8 w-px bg-[#E7D9D3]" />
              <div>
                <StatCounter staticDisplay="₹0 DRM Fee" />
                <span>Direct Author Revenue</span>
              </div>
              <div className="h-8 w-px bg-[#E7D9D3]" />
              <div>
                <StatCounter target={4.9} decimals={1} suffix=" ★" />
                <span>Reader Satisfaction</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Floating Book */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="book-container relative w-full max-w-sm">
              
              {/* Floating Badge with Soft Drop-Shadow Pulse */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 4px 14px -2px rgba(43,43,43,0.08)',
                    '0 10px 28px -4px rgba(211,150,140,0.28)',
                    '0 4px 14px -2px rgba(43,43,43,0.08)'
                  ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-2 z-20 bg-[#FFFFFF] border border-[#E7D9D3] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-[#2B2B2B]"
              >
                <Star className="w-3.5 h-3.5 text-[#D3968C] fill-[#D3968C]" />
                <span>{heroBook.badge || 'Editor Choice'}</span>
              </motion.div>

              {/* 3D Book Card Element */}
              <Link to={`/books/${bookSlug}`} className="book-card-3d relative bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] cursor-pointer group block">
                <div className="book-spine-depth" />
                
                {/* Book Cover Image Container */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner bg-[#F4EEEA] mb-5">
                  <img 
                    src={heroBook.coverUrl} 
                    alt={heroBook.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-[#FAF8F6]">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#E8C8C2] block mb-1">
                      {heroBook.genre}
                    </span>
                    <h3 className="font-editorial-serif text-xl font-bold leading-tight">
                      {heroBook.title}
                    </h3>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[13px] font-editorial-sans text-[#6E6A67]">By {heroBook.author}</p>
                    <p className="font-editorial-sans font-tabular text-[17px] font-semibold tracking-tight text-[#2B2B2B] mt-0.5">
                      {formatPrice(heroBook.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#F4EEEA] text-[#2B2B2B] text-xs font-medium font-tabular">
                      {heroBook.rating} ★ ({heroBook.reviewsCount})
                    </span>
                  </div>
                </div>

              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
