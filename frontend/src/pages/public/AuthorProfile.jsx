import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Feather, ArrowLeft, BookOpen, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AuthorProfile() {
  const { id } = useParams();
  const { getAuthorById: getAuthor, getBooksByAuthorId, authors, books } = useData();
  const author = getAuthor(id) || authors[0];

  const authorBookIds = author.books || [];
  const authorBooks = authorBookIds.length > 0
    ? authorBookIds.map(bid => books.find(b => b.id === bid)).filter(Boolean)
    : getBooksByAuthorId(author.id);

  const displayBooks = authorBooks.length > 0 ? authorBooks : books.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          to="/authors"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contributor Index</span>
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF] bg-[#F4EEEA]">
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF8F6]">
                <span className="px-3 py-1 rounded-full bg-[#FFFFFF]/20 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-[#FAF8F6] border border-[#FFFFFF]/30 inline-block mb-2">
                  Verified Studio Author
                </span>
                <p className="text-xs font-mono text-[#E8C8C2]">
                  BookVerse Contributor #{author.id.toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D3968C] font-semibold">
                {author.role}
              </span>
              <h1 className="font-editorial-serif text-5xl sm:text-6xl text-[#2B2B2B] font-normal tracking-tight">
                {author.name}
              </h1>
            </div>

            <div className="py-4 border-y border-[#E7D9D3] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#6E6A67]">
              <span><strong className="text-[#2B2B2B] font-semibold">{displayBooks.length}</strong> Works Published</span>
              <span className="text-[#E7D9D3]">·</span>
              <span><strong className="text-[#2B2B2B] font-semibold">{author.avgRating || '4.8 ★'}</strong> Average Rating</span>
              <span className="text-[#E7D9D3]">·</span>
              <span><strong className="text-[#2B2B2B] font-semibold">{author.followers}</strong> Readers</span>
              <span className="text-[#E7D9D3]">·</span>
              <span>Member {author.joinDate || 'Since 2018'}</span>
            </div>

            <blockquote className="font-editorial-serif text-2xl italic text-[#2B2B2B] leading-relaxed border-l-2 border-[#D3968C] pl-6">
              "{author.bio}"
            </blockquote>

            <div className="text-sm text-[#6E6A67] leading-relaxed space-y-4">
              <p>
                {author.fullBio || author.bio}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D3968C] font-semibold block">
                Literary Awards & Honors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#2B2B2B]">
                <div className="p-3 rounded-xl bg-[#F4EEEA] border border-[#E7D9D3]">
                  <span className="font-semibold block">Sahitya Akademi Award (1956)</span>
                  <span className="text-[10px] text-[#6E6A67]">Posthumous honor for Sivagamiyin Sabatham</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4EEEA] border border-[#E7D9D3]">
                  <span className="font-semibold block">Crossword Book Award</span>
                  <span className="text-[10px] text-[#6E6A67]">Lifetime Historical Fiction Legacy</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#6E6A67]">
              <span className="uppercase tracking-wider text-[10px]">Connect:</span>
              <a href="#" className="hover:text-[#2B2B2B] transition-colors">kalkistudio.in</a>
              <span>·</span>
              <a href="#" className="hover:text-[#2B2B2B] transition-colors">@kalkistudio</a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/author/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Author Portal</span>
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] hover:border-[#D3968C] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D3968C]" />
                <span>Follow Author</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F4EEEA] border-t border-[#E7D9D3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-1">
                Catalog Bibliography
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal">
                This Author's Shelf
              </h2>
            </div>
            <p className="text-xs text-[#6E6A67] font-mono">
              Showing {displayBooks.length} title(s) in BookVerse Studio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/books/${book.id}`}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] flex flex-col justify-between hover:border-[#D3968C] transition-all duration-300 group shadow-sm block h-full"
                >
                  <div>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] mb-4">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
                      {book.genre}
                    </span>
                    <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] line-clamp-1 mt-1 group-hover:text-[#C98579] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6E6A67] mt-1 line-clamp-2 italic">
                      "{book.synopsis}"
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                    <span className="font-editorial-serif text-base font-bold text-[#2B2B2B]">
                      ₹{book.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors">
                      Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
