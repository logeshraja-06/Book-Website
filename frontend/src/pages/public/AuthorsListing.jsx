import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, BookOpen } from 'lucide-react';
import { AUTHORS, ALL_BOOKS } from '../../data/mockData';

export default function AuthorsListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const groupedAuthors = useMemo(() => {
    let filtered = [...AUTHORS];

    if (selectedRole !== 'All') {
      filtered = filtered.filter((a) => a.role.toLowerCase().includes(selectedRole.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.bio.toLowerCase().includes(q) ||
          a.bookTitle.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const groups = {};
    filtered.forEach((author) => {
      const letter = author.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(author);
    });

    return groups;
  }, [searchQuery, selectedRole]);

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <section className="border-b border-[#E7D9D3] bg-[#FAF8F6] pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
                The Contributor Index
              </span>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#2B2B2B] font-normal tracking-tight">
                Authors & Voices
              </h1>
              <p className="text-sm text-[#6E6A67] max-w-xl leading-relaxed">
                An index of storytellers, historians, essayists, and scientists publishing through the BookVerse Studio ecosystem.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A67]" />
              <input
                type="text"
                placeholder="Search by author or discipline…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFFFFF] border border-[#E7D9D3] text-sm text-[#2B2B2B] placeholder-[#6E6A67]/60 focus:outline-none focus:border-[#D3968C] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 border-t border-[#E7D9D3]/60 pt-6 mt-8 overflow-x-auto text-xs font-mono">
            {['All', 'Historical', 'Fiction', 'Essayist', 'Scholar'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-1 uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedRole === role ? 'text-[#2B2B2B] font-semibold border-b-2 border-[#D3968C]' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                }`}
              >
                {role === 'All' ? 'All Disciplines' : role}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {Object.keys(groupedAuthors).length > 0 ? (
          <div className="space-y-16">
            {Object.keys(groupedAuthors).map((letter) => (
              <div key={letter} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-2 sticky top-24">
                  <span className="font-editorial-serif text-5xl font-light text-[#D3968C] block">
                    {letter}
                  </span>
                  <span className="text-[10px] font-mono text-[#6E6A67] uppercase tracking-widest">
                    Index Section
                  </span>
                </div>

                <div className="lg:col-span-10 divide-y divide-[#E7D9D3] border-y border-[#E7D9D3]">
                  {groupedAuthors[letter].map((author) => {
                    const authorBooks = ALL_BOOKS.filter(
                      (b) => b.authorId === author.id || b.author === author.name
                    );

                    return (
                      <motion.div
                        key={author.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5 }}
                        className="py-8 group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#F4EEEA]/50 px-4 -mx-4 rounded-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E7D9D3] group-hover:border-[#D3968C] transition-colors shrink-0">
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <Link
                              to={`/authors/${author.id}`}
                              className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] hover:text-[#C98579] transition-colors inline-flex items-center gap-2"
                            >
                              {author.name}
                              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#D3968C]" />
                            </Link>
                            <p className="text-xs font-mono uppercase tracking-wider text-[#6E6A67]">
                              {author.role}
                            </p>
                            <p className="text-xs text-[#6E6A67] max-w-md line-clamp-1 italic">
                              "{author.bio}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-[#E7D9D3]/60">
                          <div className="text-left md:text-right">
                            <span className="text-xs text-[#6E6A67] block">Key Work</span>
                            <span className="font-editorial-serif text-sm font-semibold text-[#2B2B2B]">
                              {author.bookTitle}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-[#6E6A67] block">Followers</span>
                            <span className="font-mono text-xs font-semibold text-[#2B2B2B]">
                              {author.followers}
                            </span>
                          </div>

                          <Link
                            to={`/authors/${author.id}`}
                            className="px-4 py-2 rounded-full border border-[#E7D9D3] text-xs font-medium text-[#2B2B2B] group-hover:bg-[#2B2B2B] group-hover:text-[#FAF8F6] group-hover:border-[#2B2B2B] transition-all duration-300"
                          >
                            View Profile
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 text-[#D3968C] mx-auto mb-4" />
            <h3 className="font-editorial-serif text-2xl text-[#2B2B2B]">No authors found</h3>
            <p className="text-sm text-[#6E6A67] mt-1">Try searching with a different keyword.</p>
          </div>
        )}
      </section>
    </div>
  );
}
