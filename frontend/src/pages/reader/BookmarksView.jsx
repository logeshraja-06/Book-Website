import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookMarked, Quote, ArrowUpRight } from 'lucide-react';
import { INITIAL_BOOKMARKS } from '../../data/mockReaderData';

export default function BookmarksView() {
  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            Reading Passages & Notes
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            Bookmarked excerpts and personal reflections from your shelf
          </p>
        </div>
        <span className="text-xs font-mono text-[#6E6A67]">
          {INITIAL_BOOKMARKS.length} Passages Saved
        </span>
      </div>

      {/* Quote-Style Reading Notes Cards */}
      <div className="space-y-8 max-w-4xl">
        {INITIAL_BOOKMARKS.map((bm, idx) => (
          <motion.div
            key={bm.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#E7D9D3] shadow-sm space-y-6 hover:border-[#D3968C] transition-all duration-300 relative group"
          >
            {/* Top Bar: Book Reference & Page */}
            <div className="flex items-center justify-between border-b border-[#E7D9D3]/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center text-[#D3968C]">
                  <Quote className="w-4 h-4" />
                </div>
                <div>
                  <Link
                    to={`/books/${bm.bookId}`}
                    className="font-editorial-serif text-base font-bold text-[#2B2B2B] hover:text-[#C98579] transition-colors inline-flex items-center gap-1.5"
                  >
                    {bm.bookTitle}
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D3968C]" />
                  </Link>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67] block">
                    {bm.pageRef}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-[#6E6A67]">{bm.dateSaved}</span>
            </div>

            {/* Quote Body in Serif */}
            <blockquote className="font-editorial-serif text-xl sm:text-2xl text-[#2B2B2B] italic leading-relaxed pl-4 border-l-2 border-[#D3968C]">
              "{bm.quote}"
            </blockquote>

            {/* Personal Note Annotation */}
            <div className="p-4 rounded-xl bg-[#F4EEEA]/60 border border-[#E7D9D3]/50 text-xs text-[#6E6A67] leading-relaxed">
              <span className="font-mono uppercase font-semibold text-[#2B2B2B] block mb-1">
                Personal Annotation
              </span>
              {bm.note}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
