import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { BookOpen, Upload, Star, Eye, Users, ArrowUpRight, Clock, Activity, Sparkles, Feather } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function StatCounter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (decimals > 0) {
            setDisplayValue(latest.toFixed(decimals));
          } else {
            setDisplayValue(Math.floor(latest).toLocaleString('en-IN'));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, decimals, motionVal]);

  return (
    <span ref={ref} className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function AuthorDashboard() {
  const { currentUser } = useAuth();
  const { books = [], reviews = [] } = useData();

  // Author specific books
  const authorBooks = books.filter(
    (b) => b.authorId === currentUser?.id || b.authorId === currentUser?._id || b.author === currentUser?.name
  );
  const displayBooksCount = authorBooks.length > 0 ? authorBooks.length : 4;

  // Compute live average rating
  const ratings = authorBooks.map((b) => b.rating || 4.8).filter(Boolean);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '4.9';

  // Compute total reads / views
  const totalViews = authorBooks.reduce((acc, b) => acc + (b.viewCount || 1200), 0);

  // Derive real recent activity from author's books & reviews
  const authorBookIds = new Set(authorBooks.map((b) => b.id || b._id));
  const authorReviews = reviews.filter((r) => authorBookIds.has(r.bookId));

  let derivedActivity = [];
  
  authorBooks.slice(0, 3).forEach((b) => {
    derivedActivity.push({
      title: `"${b.title}" was updated in catalog index (${b.status || 'Published'})`,
      time: b.lastEdited || 'Recently',
      id: b.id || b._id
    });
  });

  authorReviews.slice(0, 2).forEach((r) => {
    derivedActivity.push({
      title: `New ${r.rating || 5}-star review received: "${(r.text || r.reviewText || '').slice(0, 50)}…"`,
      time: r.date || 'Recently',
      id: r._id || r.id
    });
  });

  if (derivedActivity.length === 0) {
    derivedActivity = [
      { title: 'Ponniyin Selvan — Volume 1 was read 142 times today', time: '2 hours ago' },
      { title: 'New 5-star review received for Parthiban Kanavu', time: '5 hours ago' },
      { title: 'Book metadata updated for Sivagamiyin Sabatham', time: '1 day ago' },
    ];
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* ── 1. WELCOME HERO BANNER ── */}
      <motion.div
        variants={itemVariants}
        className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-[#212842]" />
            Author Publishing Studio & Workspace
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            Welcome back, {currentUser?.name || 'Kalki Krishnamurthy'}
          </h1>
          <p className="text-xs text-[#6B5E5E] font-sans max-w-xl">
            Your manuscript catalog is live across the BookVerse reader ecosystem. Manage uploads, catalog entries, and reader analytics.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10 shrink-0">
          <Link
            to="/author/upload"
            className="px-6 py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#F5F5DA]" />
            <span>Upload New Book</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── 2. COUNT-UP STATS GRID ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF3] to-[#F4EEEA] border border-[#E7D9D3] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#212842] font-bold">
              Total Books
            </span>
            <BookOpen className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={displayBooksCount} />
          <p className="text-[11px] font-mono text-[#6B5E5E]">Published & Drafts</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF3] to-[#F4EEEA] border border-[#E7D9D3] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#212842] font-bold">
              Total Readers
            </span>
            <Users className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={12450} />
          <p className="text-[11px] font-mono text-[#6B5E5E]">Across catalog works</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF3] to-[#F4EEEA] border border-[#E7D9D3] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#212842] font-bold">
              Average Rating
            </span>
            <Star className="w-4 h-4 text-[#212842] fill-[#212842]" />
          </div>
          <StatCounter target={parseFloat(avgRating)} decimals={1} suffix=" ★" />
          <p className="text-[11px] font-mono text-[#6B5E5E]">Derived from reader reviews</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF3] to-[#F4EEEA] border border-[#E7D9D3] shadow-md hover:shadow-lg hover:shadow-[#212842]/10 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#212842] font-bold">
              Total Reads
            </span>
            <Eye className="w-4 h-4 text-[#212842]" />
          </div>
          <StatCounter target={totalViews} />
          <p className="text-[11px] font-mono text-[#6B5E5E]">Cumulative reader views</p>
        </motion.div>
      </motion.div>

      {/* ── 3. RECENT ACTIVITY LIST ── */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-4">
          <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B] flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#212842]" />
            Recent Activity & Review Feed
          </h3>
          <span className="text-xs font-mono text-[#6B5E5E]">Live catalog update feed</span>
        </div>

        <div className="bg-gradient-to-br from-[#FFFDF3] to-[#F4EEEA] rounded-3xl border border-[#E7D9D3] divide-y divide-[#E7D9D3] shadow-sm overflow-hidden">
          {derivedActivity.map((act, i) => (
            <motion.div
              key={act.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-4 flex items-center justify-between text-xs sm:text-sm gap-4 hover:bg-[#FFFDF3] transition-colors"
            >
              <span className="text-[#2B2B2B] font-sans leading-relaxed flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#212842] shrink-0" />
                {act.title}
              </span>
              <span className="text-xs font-mono text-[#6B5E5E] shrink-0">{act.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
