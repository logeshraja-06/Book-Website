import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { categories: CATEGORIES, books: ALL_BOOKS } = useData();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      <section className="border-b border-[#E9E5C8] bg-[#F5F5DA] pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-2">
            {t('listing.categories.eyebrow')}
          </span>
          <h1 className="font-editorial-serif text-5xl sm:text-6xl text-[#211D1D] font-normal tracking-tight">
            {t('listing.categories.title')}
          </h1>
          <p className="text-base text-[#6B5E5E] max-w-2xl mt-4 leading-relaxed font-sans">
            {t('listing.categories.subtitle')}
          </p>
        </div>
      </section>

      <section className="divide-y divide-[#E9E5C8]">
        {CATEGORIES.map((cat, idx) => {
          const catId = cat._id || cat.id;
          const matchingBooks = ALL_BOOKS.filter(
            (b) => b.genre && (b.genre.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0]) || b.genre === cat.name)
          );

          const isHovered = hoveredCategory === catId;
          const isEven = idx % 2 === 1;

          return (
            <motion.div
              key={catId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredCategory(catId)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => navigate(`/books`)}
              className="relative transition-all duration-500 py-16 lg:py-24 cursor-pointer bg-[#F5F5DA] hover:bg-[#FFFDF3]/80 group"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#212842] font-bold">
                        {t('listing.categories.chapter')} 0{idx + 1}
                      </span>
                      <span className="h-px w-12 bg-[#E9E5C8]" />
                      <span className="font-mono text-xs text-[#6B5E5E] uppercase tracking-widest">
                        {matchingBooks.length || cat.count || 0} {t('listing.categories.titlesArchived')}
                      </span>
                    </div>

                    <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#211D1D] group-hover:text-[#212842] transition-colors leading-tight font-normal">
                      {cat.name}
                    </h2>

                    <p className="text-base text-[#6B5E5E] max-w-xl leading-relaxed font-sans">
                      {cat.desc || cat.description}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#211D1D] font-bold group-hover:text-[#212842] transition-colors">
                        <span>{t('listing.categories.exploreCollection')} {cat.name}</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-4 overflow-hidden py-2">
                      {matchingBooks.length > 0 ? (
                        matchingBooks.slice(0, 3).map((book, bIdx) => (
                          <motion.div
                            key={`${book.slug || book.id || book._id || 'cat-bk'}-${bIdx}`}
                            animate={{
                              y: isHovered ? (bIdx === 1 ? -12 : 0) : 0,
                              scale: isHovered ? 1.05 : 1,
                              rotate: isHovered ? (bIdx === 0 ? -3 : bIdx === 2 ? 3 : 0) : 0,
                            }}
                            transition={{ duration: 0.4, delay: bIdx * 0.05 }}
                            className="w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8] shadow-md shrink-0 transition-shadow duration-300 group-hover:shadow-xl"
                          >
                            <img
                              src={book.coverImage || book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80';
                              }}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          animate={{
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.4 }}
                          className="w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#FFFDF3] border border-[#E9E5C8] shadow-md shrink-0 transition-shadow duration-300 group-hover:shadow-xl"
                        >
                          <img
                            src={cat.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
