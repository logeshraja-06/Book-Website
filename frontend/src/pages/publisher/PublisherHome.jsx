import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, BookOpen, Clock, ShieldCheck, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function PublisherHome() {
  const { books, editorialBooks, editorialQueue } = useData();

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  const pendingCount = editorialQueue.length > 0 ? editorialQueue.length : catalogSource.filter((b) => b.status === 'In Review').length;
  const approvedCount = catalogSource.filter((b) => b.status === 'Published').length;
  const recentSubmissions = editorialQueue.length > 0 ? editorialQueue.slice(0, 4) : catalogSource.slice(0, 4);

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7B021D] font-bold block">
            Publisher & Admin Control Desk
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal mt-1">
            Publisher Workspace
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1">
            Centralized back-office for manuscript evaluation, author management, and catalog taxonomy
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/publisher/categories"
            className="px-4 py-2.5 rounded-full border border-[#E9E5C8] text-[#211D1D] text-xs font-bold uppercase tracking-wider hover:border-[#7B021D] transition-colors"
          >
            Manage Categories
          </Link>
          <Link
            to="/publisher/queue"
            className="px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-sm"
          >
            Open Review Queue ({pendingCount})
          </Link>
        </div>
      </div>

      {/* Quiet Typographic Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E9E5C8]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold">
            Today's Submissions
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
            2 Manuscripts
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold">
            Pending Reviews
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
            {pendingCount}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold">
            Approved Manuscripts
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
            {approvedCount}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold">
            Average Review Time
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
            1.8 Days
          </p>
        </div>
      </div>

      {/* Recent Publications & Queue Short Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Recent Submissions Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-3">
            <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
              Latest Submissions Activity
            </h3>
            <Link
              to="/publisher/queue"
              className="text-xs font-mono text-[#7B021D] hover:underline inline-flex items-center gap-1 font-bold"
            >
              <span>View Queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentSubmissions.map((book, idx) => (
              <div
                key={book.id || book._id || `recent-${idx}`}
                className="bg-[#FFFDF3] rounded-2xl p-4 border border-[#E9E5C8] flex items-center justify-between gap-4 hover:border-[#7B021D] transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-14 rounded overflow-hidden bg-[#F5F5DA] shrink-0 border border-[#E9E5C8]">
                    <img src={book.coverImage || book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-editorial-serif text-base font-bold text-[#211D1D]">{book.title}</h4>
                    <p className="text-xs text-[#6B5E5E]">By {book.author} · {book.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#7B021D]">
                    {book.status}
                  </span>
                  <Link
                    to={`/publisher/review/${book.id || book._id}`}
                    className="text-xs font-bold uppercase font-mono text-[#211D1D] hover:text-[#7B021D]"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Quick Actions & Editorial Policy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDF3] rounded-3xl p-6 border border-[#E9E5C8] shadow-2xs space-y-4">
            <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D]">
              Publisher Protocol
            </h3>
            <p className="text-xs text-[#6B5E5E] leading-relaxed">
              All submitted manuscripts are checked for offline manuscript file integrity, metadata accuracy, and catalog suitability. Publisher decisions are communicated via quiet text labels, maintaining our dignified review philosophy.
            </p>

            <div className="pt-2 border-t border-[#E9E5C8] space-y-2">
              <Link
                to="/publisher/queue"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F5DA] hover:bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono text-[#211D1D] transition-colors"
              >
                <span>Submission Queue</span>
                <ArrowRight className="w-4 h-4 text-[#7B021D]" />
              </Link>
              <Link
                to="/publisher/categories"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F5DA] hover:bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono text-[#211D1D] transition-colors"
              >
                <span>Taxonomy & Categories</span>
                <ArrowRight className="w-4 h-4 text-[#7B021D]" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
