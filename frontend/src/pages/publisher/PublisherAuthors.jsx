import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export default function PublisherAuthors() {
  const { authors, books, editorialBooks } = useData();

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#E7D9D3] pb-4">
        <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
          Registered Catalog Authors
        </h2>
        <p className="text-xs text-[#6E6A67]">{authors.length} Authors Enrolled in Platform</p>
      </div>

      {/* Editorial List */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] divide-y divide-[#E7D9D3] shadow-sm">
        {authors.map((author, idx) => {
          const authorId = author._id || author.id;
          const authorBookCount = (author.books || []).length || catalogSource.filter((b) => b.authorId === authorId || b.authorId === author.id || b.author === author.name).length;

          return (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4EEEA]/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E7D9D3]"
                />
                <div>
                  <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">{author.name}</h4>
                  <p className="text-xs text-[#6E6A67]">{author.role} · {authorBookCount} Works</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7D9D3]">
                <span className="text-xs font-mono text-[#6E6A67]">{author.followers} Readers</span>
                <span className="text-xs font-mono text-[#2B2B2B] font-semibold">Active</span>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <Link
                    to={`/authors/${author.id}`}
                    className="font-semibold uppercase tracking-wider text-[#2B2B2B] hover:text-[#D3968C]"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/publisher/books?author=${author.id}`}
                    className="font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B]"
                  >
                    View Books
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
