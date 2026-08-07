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
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/authors/${authorSlug}`}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#D3968C] transition-all duration-300 group block h-full"
                >
                  <div>
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#E7D9D3] group-hover:border-[#D3968C] transition-colors duration-300 mb-5 mx-auto">
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="text-center space-y-1.5">
                      <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] group-hover:text-[#C98579] transition-colors">
                        {author.name}
                      </h3>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#6E6A67]">
                        {author.role}
                      </p>
                      <p className="text-xs text-[#6E6A67] leading-relaxed pt-2 line-clamp-3 italic">
                        "{author.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-6 border-t border-[#E7D9D3]/60 flex items-center justify-between text-xs text-[#6E6A67]">
                    <span>{author.publications || author.booksCount || 0} Works</span>
                    <span className="font-medium text-[#2B2B2B] flex items-center gap-1">
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
