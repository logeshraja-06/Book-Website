import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Star, Eye, Users, ArrowUpRight, Clock, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function AuthorDashboard() {
  const { currentUser } = useAuth();
  const { books } = useData();

  // Author specific books count
  const authorBooks = books.filter((b) => b.authorId === currentUser?.id || b.author === currentUser?.name);
  const displayBooksCount = authorBooks.length || 4;

  const stats = [
    { label: 'Total Books', value: displayBooksCount, sub: 'Published & Drafts' },
    { label: 'Total Readers', value: '12,450', sub: 'Across 4 titles' },
    { label: 'Average Rating', value: '4.9 ★', sub: 'Based on 480 reviews' },
    { label: 'Total Reads', value: '48.2k', sub: 'Lifetime reads' },
  ];

  const recentActivity = [
    { title: 'Ponniyin Selvan — Volume 1 was read 142 times today', time: '2 hours ago' },
    { title: 'New 5-star review received for Parthiban Kanavu', time: '5 hours ago' },
    { title: 'Book metadata updated for Sivagamiyin Sabatham', time: '1 day ago' },
    { title: 'New reader added Ponniyin Selvan to My Shelf', time: '2 days ago' },
    { title: 'Monthly royalty estimate updated in catalog registry', time: '3 days ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      {/* ── Welcome Banner ── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#F4EEEA] border border-[#E7D9D3] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#D3968C] font-semibold">
            Author Publishing Studio
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal">
            Welcome back, {currentUser?.name || 'Kalki Krishnamurthy'}
          </h1>
          <p className="text-sm text-[#6E6A67]">
            Your manuscript catalog is live across the BookVerse reader ecosystem.
          </p>
        </div>

        <Link
          to="/author/upload"
          className="px-6 py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center gap-2 shrink-0"
        >
          <Upload className="w-4 h-4 text-[#D3968C]" />
          <span>Upload New Book</span>
        </Link>
      </div>

      {/* ── Quiet Typographic Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-[#FAF8F6] border border-[#E7D9D3] space-y-2"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-[#6E6A67]">
              {stat.label}
            </span>
            <div className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
              {stat.value}
            </div>
            <p className="text-[11px] font-mono text-[#6E6A67] opacity-80">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Activity List (Text-Based Feed) ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-3">
          <h3 className="font-editorial-serif text-xl font-normal text-[#2B2B2B] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D3968C]" />
            Recent Activity
          </h3>
          <span className="text-xs font-mono text-[#6E6A67]">Real-time reader feed</span>
        </div>

        <div className="divide-y divide-[#E7D9D3]/60">
          {recentActivity.map((act, i) => (
            <div key={i} className="py-4 flex items-center justify-between text-sm gap-4">
              <span className="text-[#2B2B2B] leading-relaxed">{act.title}</span>
              <span className="text-xs font-mono text-[#6E6A67] shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
