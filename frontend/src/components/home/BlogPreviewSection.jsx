import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BlogEditorialCard } from '../ui/EditorialCards';

export default function BlogPreviewSection() {
  const posts = [
    {
      id: 'drm-free-integrity',
      title: 'The Architecture of DRM-Free Digital Books',
      excerpt: 'Why digital literature ownership matters in an era of revokable cloud licenses.',
      readTime: '4 min read',
      date: 'Aug 2025',
      category: 'Digital Sovereignty',
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'historical-realism',
      title: 'On Historical Realism in Modern Indian Literature',
      excerpt: 'Tracing dynastic narratives from 10th-century Tanjore to contemporary historical epics.',
      readTime: '6 min read',
      date: 'Jul 2025',
      category: 'Literary History',
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'typography-in-publishing',
      title: 'Why Typography Matters More Than Metadata',
      excerpt: 'How optical margins, line length, and typeface selection dictate narrative comprehension.',
      readTime: '5 min read',
      date: 'Jun 2025',
      category: 'Editorial Craft',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-24 bg-[#F5F5DA] border-t border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E9E5C8] pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block mb-2">
              Studio Essays & Journal
            </span>
            <h2 className="font-editorial-serif text-4xl text-[#211D1D] font-normal tracking-tight">
              Publishing Craft & Essays
            </h2>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7B021D] hover:text-[#520014] transition-colors"
          >
            <span>Read All Essays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Article Preview Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <BlogEditorialCard key={post.id} article={post} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
