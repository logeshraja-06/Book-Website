import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BlogEditorialCard } from '../../components/ui/EditorialCards';

export default function BlogPage() {
  const posts = [
    {
      id: 'drm-free-integrity',
      title: 'The Architecture of DRM-Free Digital Books',
      author: 'Kalki Krishnamurthy',
      date: 'August 14, 2025',
      readTime: '4 min read',
      category: 'Digital Sovereignty',
      summary: 'Why digital literature ownership matters in an era of revokable cloud licenses.',
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'historical-realism',
      title: 'On Historical Realism in Modern Indian Literature',
      author: 'Arundhati Roy',
      date: 'July 28, 2025',
      readTime: '6 min read',
      category: 'Literary History',
      summary: 'Tracing dynastic narratives from 10th-century Tanjore to contemporary historical epics.',
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'typography-in-publishing',
      title: 'Why Typography Matters More Than Metadata in Publishing',
      author: 'Vikram Seth',
      date: 'June 19, 2025',
      readTime: '5 min read',
      category: 'Editorial Craft',
      summary: 'How optical margins, line length, and typeface selection dictate narrative comprehension.',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5DA] py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E5E] hover:text-[#211D1D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b border-[#E9E5C8] pb-8">
          <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold">
            BookVerse Gazette & Journal
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl text-[#211D1D] font-normal">
            Essays on Publishing & Craft
          </h1>
          <p className="text-sm text-[#6B5E5E] max-w-xl leading-relaxed font-sans">
            Explorations into DRM-free literature, typography craft, historical narrative architecture, and independent author control.
          </p>
        </div>

        {/* 3-Column Blog Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <BlogEditorialCard key={post.id} article={post} index={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}
