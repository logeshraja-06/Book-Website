import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { ArrowUpRight } from 'lucide-react';

export default function CategorySection() {
  const { categories } = useData();

  return (
    <section id="categories" className="py-28 bg-[#FAF8F6] relative overflow-hidden">
      {/* Background Subtle Typography Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none font-editorial-serif text-[220px] font-bold text-[#2B2B2B] leading-none whitespace-nowrap">
        GENRES & TAXONOMY
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-20">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] block mb-2 font-semibold">
            Catalog Taxonomy
          </span>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] font-normal tracking-tight">
            Explore by Category
          </h2>
        </div>

        {/* Large Typographic Links List */}
        <div className="divide-y divide-[#E7D9D3]">
          {categories.map((cat, idx) => {
            const catSlug = cat.id || cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  to={`/categories/${catSlug}`}
                  className="py-8 group flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300 hover:px-4 block"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[#D3968C]">0{idx + 1}</span>
                      <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] group-hover:text-[#C98579] transition-colors duration-300 hover-underline-accent inline-block">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-sm text-[#6E6A67] pl-8 leading-relaxed font-normal">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pl-8 md:pl-0">
                    <div className="text-right hidden sm:block">
                      <span className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] block">
                        {cat.count || 0}
                      </span>
                      <span className="text-[11px] font-mono text-[#6E6A67] uppercase tracking-wider">
                        Titles Indexed
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-[#E7D9D3] group-hover:border-[#D3968C] group-hover:bg-[#D3968C] group-hover:text-[#FAF8F6] text-[#2B2B2B] flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
