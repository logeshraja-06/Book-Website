import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Star, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURED_BOOKS } from '../../data/mockData';

export default function HeroSection() {
  const heroBook = FEATURED_BOOKS[0]; // Ponniyin Selvan

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-[#FAF8F6]">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#E8C8C2]/30 via-[#F4EEEA]/50 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Blur Reveal */}
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#6E6A67] text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D3968C]" />
              <span>Digital Publishing Platform</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-editorial-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#2B2B2B] leading-[1.08] font-normal">
              Where stories find their <span className="italic font-light text-[#C98579]">eternal form.</span>
            </h1>

            {/* Sub-Headline Copy */}
            <p className="text-base sm:text-lg text-[#6E6A67] leading-relaxed max-w-xl font-normal">
              BookVerse Studio is an interconnected ecosystem designed for authors to craft manuscripts, independent publishers to curate catalogs, and readers to discover literary treasures.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/books"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-sm font-semibold tracking-wide hover:bg-[#D3968C] transition-all duration-300 shadow-md hover:shadow-lg group min-h-[44px]"
              >
                <span>Explore Books</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#authors"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#2B2B2B] text-sm font-medium hover:border-[#D3968C] hover:bg-[#FAF8F6] transition-all duration-300 min-h-[44px]"
              >
                <Compass className="w-4 h-4 text-[#6E6A67]" />
                <span>Meet Our Authors</span>
              </a>
            </div>

            {/* Micro Credibility Line */}
            <div className="pt-6 border-t border-[#E7D9D3]/60 flex items-center gap-8 text-xs text-[#6E6A67]">
              <div>
                <span className="font-editorial-serif text-lg font-bold text-[#2B2B2B] block">4,200+</span>
                <span>Curated Manuscripts</span>
              </div>
              <div className="h-8 w-px bg-[#E7D9D3]" />
              <div>
                <span className="font-editorial-serif text-lg font-bold text-[#2B2B2B] block">₹0 DRM Fee</span>
                <span>Direct Author Revenue</span>
              </div>
              <div className="h-8 w-px bg-[#E7D9D3]" />
              <div>
                <span className="font-editorial-serif text-lg font-bold text-[#2B2B2B] block">4.9 ★</span>
                <span>Reader Satisfaction</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Floating Book */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="book-container relative w-full max-w-sm">
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-2 z-20 bg-[#FFFFFF] border border-[#E7D9D3] px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold text-[#2B2B2B]">
                <Star className="w-3.5 h-3.5 text-[#D3968C] fill-[#D3968C]" />
                <span>{heroBook.badge}</span>
              </div>

              {/* 3D Book Card Element */}
              <Link to={`/books/${heroBook.id}`} className="book-card-3d relative bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] cursor-pointer group block">
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
                    <p className="text-xs text-[#6E6A67]">By {heroBook.author}</p>
                    <p className="font-editorial-serif text-lg font-semibold text-[#2B2B2B] mt-0.5">
                      ₹{heroBook.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#F4EEEA] text-[#2B2B2B] text-xs font-medium">
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
