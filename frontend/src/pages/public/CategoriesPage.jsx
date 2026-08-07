import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function CategoriesPage() {
  const { categories: CATEGORIES, books: ALL_BOOKS } = useData();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <section className="border-b border-[#E7D9D3] bg-[#FAF8F6] pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-2">
            Taxonomy & Literary Index
          </span>
          <h1 className="font-editorial-serif text-5xl sm:text-6xl text-[#2B2B2B] font-normal tracking-tight">
            Table of Contents
          </h1>
          <p className="text-base text-[#6E6A67] max-w-2xl mt-4 leading-relaxed">
            An editorial index of BookVerse Studio’s curated literary genres. Select any category row to explore titles, manuscript collections, and author perspectives.
          </p>
        </div>
      </section>

      <section className="divide-y divide-[#E7D9D3]">
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
              className="relative transition-all duration-500 py-16 lg:py-24 cursor-pointer bg-[#FAF8F6] hover:bg-[#F4EEEA]/50 group"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#D3968C] font-semibold">
                        CHAPTER 0{idx + 1}
                      </span>
                      <span className="h-px w-12 bg-[#E7D9D3]" />
                      <span className="font-mono text-xs text-[#6E6A67] uppercase tracking-widest">
                        {matchingBooks.length || cat.count || 0} Titles Archived
                      </span>
                    </div>

                    <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2B2B] group-hover:text-[#C98579] transition-colors leading-tight font-normal">
                      {cat.name}
                    </h2>

                    <p className="text-base text-[#6E6A67] max-w-xl leading-relaxed">
                      {cat.desc || cat.description}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2B2B2B] font-semibold group-hover:text-[#D3968C] transition-colors">
                        <span>Explore {cat.name} Collection</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-4 overflow-hidden py-2">
                      {matchingBooks.slice(0, 3).map((book, bIdx) => (
                        <motion.div
                          key={book.id || book._id}
                          animate={{
                            y: isHovered ? (bIdx === 1 ? -12 : 0) : 0,
                            scale: isHovered ? 1.05 : 1,
                            rotate: isHovered ? (bIdx === 0 ? -3 : bIdx === 2 ? 3 : 0) : 0,
                          }}
                          transition={{ duration: 0.4, delay: bIdx * 0.05 }}
                          className="w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden bg-[#F4EEEA] border border-[#E7D9D3] shadow-md shrink-0 transition-shadow duration-300 group-hover:shadow-xl"
                        >
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
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
