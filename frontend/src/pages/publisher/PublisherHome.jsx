import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, BookOpen, Clock, ShieldCheck, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function PublisherHome() {
  const { books, editorialQueue } = useData();

  const pendingCount = books.filter((b) => b.status === 'In Review').length;
  const approvedCount = books.filter((b) => b.status === 'Published').length;
  const recentSubmissions = books.slice(0, 4);

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D3968C] font-semibold block">
            Publisher & Admin Control Desk
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal mt-1">
            Publisher Workspace
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            Centralized back-office for manuscript evaluation, author management, and catalog taxonomy
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/publisher/categories"
            className="px-4 py-2.5 rounded-full border border-[#E7D9D3] text-[#2B2B2B] text-xs font-semibold uppercase tracking-wider hover:border-[#D3968C] transition-colors"
          >
            Manage Categories
          </Link>
          <Link
            to="/publisher/queue"
            className="px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
          >
            Open Review Queue ({pendingCount})
          </Link>
        </div>
      </div>

      {/* Quiet Typographic Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E7D9D3]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Today's Submissions
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            2 Manuscripts
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Pending Reviews
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {pendingCount}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Approved Manuscripts
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {approvedCount}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Average Review Time
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            1.8 Days
          </p>
        </div>
      </div>

      {/* Recent Publications & Queue Short Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Recent Submissions Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-3">
            <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
              Latest Submissions Activity
            </h3>
            <Link
              to="/publisher/queue"
              className="text-xs font-mono text-[#D3968C] hover:underline inline-flex items-center gap-1"
            >
              <span>View Queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentSubmissions.map((book) => (
              <div
                key={book.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E7D9D3] flex items-center justify-between gap-4 hover:border-[#D3968C] transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-14 rounded overflow-hidden bg-[#F4EEEA] shrink-0 border border-[#E7D9D3]">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">{book.title}</h4>
                    <p className="text-xs text-[#6E6A67]">By {book.author} · {book.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#2B2B2B]">
                    {book.status}
                  </span>
                  <Link
                    to={`/publisher/review/${book.id}`}
                    className="text-xs font-semibold uppercase font-mono text-[#2B2B2B] hover:text-[#D3968C]"
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
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] shadow-sm space-y-4">
            <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B]">
              Publisher Protocol
            </h3>
            <p className="text-xs text-[#6E6A67] leading-relaxed">
              All submitted manuscripts are checked for offline manuscript file integrity, metadata accuracy, and catalog suitability. Publisher decisions are communicated via quiet text labels, maintaining our dignified review philosophy.
            </p>

            <div className="pt-2 border-t border-[#E7D9D3] space-y-2">
              <Link
                to="/publisher/queue"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F4EEEA] hover:bg-[#FAF8F6] border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] transition-colors"
              >
                <span>Submission Queue</span>
                <ArrowRight className="w-4 h-4 text-[#D3968C]" />
              </Link>
              <Link
                to="/publisher/categories"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F4EEEA] hover:bg-[#FAF8F6] border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] transition-colors"
              >
                <span>Taxonomy & Categories</span>
                <ArrowRight className="w-4 h-4 text-[#D3968C]" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
