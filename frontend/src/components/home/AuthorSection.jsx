import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Feather } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AuthorSection() {
  const { authors } = useData();

  return (
    <section id="authors" className="py-24 bg-[#F4EEEA] border-y border-[#E7D9D3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] block mb-2 font-semibold">
              The Writers Guild
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] font-normal tracking-tight">
              Meet the Authors
            </h2>
          </div>
          <Link
            to="/authors"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] hover:text-[#D3968C] transition-colors"
          >
            <span>Explore Author Index</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {authors.map((author, idx) => {
            const authorSlug = author.slug || author.id || author.name.toLowerCase().replace(/\s+/g, '-');
            return (
              <motion.div
                key={authorSlug || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              >
                <Link
                  to={`/authors/${authorSlug}`}
                  className="relative bg-[#FFFFFF] rounded-3xl p-7 border border-[#E7D9D3] flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-[#2B2B2B]/[0.06] transition-all duration-500 group block h-full overflow-hidden"
                >
                  {/* Subtle accent glow on hover */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#D3968C]/0 group-hover:bg-[#D3968C]/[0.08] rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Avatar with animated ring */}
                    <div className="relative w-20 h-20 mx-auto mb-5">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#D3968C]/0 group-hover:border-[#D3968C]/60"
                        transition={{ duration: 0.4 }}
                      />
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#E7D9D3] group-hover:border-transparent transition-colors duration-300">
                        <img
                          src={author.avatarUrl}
                          alt={author.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="font-editorial-serif text-[19px] font-semibold tracking-tight text-[#2B2B2B] group-hover:text-[#C98579] transition-colors duration-400">
                        {author.name}
                      </h3>
                      <p className="text-[11px] font-editorial-sans uppercase tracking-[0.12em] text-[#D3968C] font-semibold">
                        {author.role}
                      </p>
                      <p className="text-[13px] font-editorial-sans text-[#6E6A67] leading-relaxed pt-2 line-clamp-3 italic">
                        "{author.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-5 mt-6 border-t border-[#E7D9D3]/70 flex items-center justify-between text-[12px] font-editorial-sans">
                    <span className="text-[#6E6A67] font-tabular">
                      {author.publications || author.booksCount || 0} Works
                    </span>
                    <span className="font-semibold text-[#2B2B2B] flex items-center gap-1.5 font-tabular">
                      <Feather className="w-3 h-3 text-[#D3968C]" />
                      {author.followers || '1.2k'}
                    </span>
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
