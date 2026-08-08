import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AuthorsListing() {
  const { authors: AUTHORS, books: ALL_BOOKS } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const groupedAuthors = useMemo(() => {
    let filtered = [...AUTHORS];

    if (selectedRole !== 'All') {
      filtered = filtered.filter((a) => (a.role || '').toLowerCase().includes(selectedRole.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.name || '').toLowerCase().includes(q) ||
          (a.role || '').toLowerCase().includes(q) ||
          (a.bio || '').toLowerCase().includes(q) ||
          (a.bookTitle || '').toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const groups = {};
    filtered.forEach((author) => {
      const nameStr = author.name || 'Author';
      const letter = nameStr.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(author);
    });

    return groups;
  }, [AUTHORS, searchQuery, selectedRole]);

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      <section className="border-b border-[#E9E5C8] bg-[#F5F5DA] pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
                The Contributor Index
              </span>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[#211D1D] font-normal tracking-tight">
                Authors & Voices
              </h1>
              <p className="text-sm text-[#6B5E5E] max-w-xl leading-relaxed font-sans">
                An index of storytellers, historians, essayists, and scientists publishing through the BookVerse Studio ecosystem.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E5E]" />
              <input
                type="text"
                placeholder="Search by author or discipline…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-sm text-[#211D1D] placeholder-[#6B5E5E]/60 focus:outline-none focus:border-[#7B021D] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 border-t border-[#E9E5C8] pt-6 mt-8 overflow-x-auto text-xs font-mono">
            {['All', 'Historical', 'Fiction', 'Essayist', 'Scholar'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-1 uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedRole === role ? 'text-[#211D1D] font-bold border-b-2 border-[#7B021D]' : 'text-[#6B5E5E] hover:text-[#211D1D]'
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
                  <span className="font-editorial-serif text-5xl font-light text-[#7B021D] block">
                    {letter}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B5E5E] uppercase tracking-widest font-bold">
                    Index Section
                  </span>
                </div>

                <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedAuthors[letter].map((author) => {
                    const authorSlug = author.slug || author.id || author.name?.toLowerCase().replace(/\s+/g, '-');
                    const authorBooks = ALL_BOOKS.filter(
                      (b) => b.authorId === author.id || (b.author && b.author.toLowerCase().includes(author.name?.toLowerCase()))
                    );

                    return (
                      <motion.div
                        key={authorSlug}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                      >
                        <Link
                          to={`/authors/${authorSlug}`}
                          className="bg-[#FFFDF3] rounded-2xl p-6 border border-[#E9E5C8] hover:border-[#7B021D] shadow-2xs hover:shadow-xl hover:shadow-[#520014]/[0.06] transition-all duration-300 flex flex-col justify-between h-full group block"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={author.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                                alt={author.name}
                                className="w-14 h-14 rounded-full object-cover border border-[#E9E5C8] group-hover:scale-105 transition-transform"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] font-bold block truncate">
                                  {author.role || 'Author'}
                                </span>
                                <h3 className="font-editorial-serif text-xl font-semibold text-[#211D1D] group-hover:text-[#7B021D] transition-colors truncate">
                                  {author.name}
                                </h3>
                              </div>
                            </div>

                            <p className="text-xs text-[#6B5E5E] leading-relaxed line-clamp-3 italic">
                              "{author.bio || 'Contributing seminal manuscripts to the BookVerse catalog.'}"
                            </p>
                          </div>

                          <div className="pt-4 mt-6 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-mono">
                            <span className="text-[#6B5E5E]">
                              {authorBooks.length || author.worksCount || 1} Works Archived
                            </span>
                            <span className="inline-flex items-center gap-1 text-[#211D1D] group-hover:text-[#7B021D] transition-colors font-semibold">
                              View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-3">
            <BookOpen className="w-8 h-8 text-[#7B021D] mx-auto" />
            <h3 className="font-editorial-serif text-2xl text-[#211D1D]">No Authors Found</h3>
            <p className="text-xs text-[#6B5E5E]">Try clearing search parameters to browse the full guild.</p>
          </div>
        )}
      </section>
    </div>
  );
}
