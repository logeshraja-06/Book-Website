import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BlogPreviewSection() {
  const posts = [
    {
      id: 'drm-free-integrity',
      title: 'The Architecture of DRM-Free Digital Books',
      excerpt: 'Why digital literature ownership matters in an era of revokable cloud licenses.',
      readTime: '4 min read',
      date: 'Aug 2025'
    },
    {
      id: 'historical-realism',
      title: 'On Historical Realism in Modern Indian Literature',
      excerpt: 'Tracing dynastic narratives from 10th-century Tanjore to contemporary historical epics.',
      readTime: '6 min read',
      date: 'Jul 2025'
    },
    {
      id: 'typography-in-publishing',
      title: 'Why Typography Matters More Than Metadata',
      excerpt: 'How optical margins, line length, and typeface selection dictate narrative comprehension.',
      readTime: '5 min read',
      date: 'Jun 2025'
    }
  ];

  return (
    <section className="py-24 bg-[#F5F5DA] border-t border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to="/blog"
                className="bg-[#FFFDF3] rounded-2xl p-6 border border-[#E9E5C8] shadow-2xs flex flex-col justify-between h-full hover:border-[#7B021D] transition-all duration-300 group block"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6B5E5E]">
                    <span>{post.date}</span>
                    <span className="text-[#7B021D] font-bold">{post.readTime}</span>
                  </div>

                  <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#6B5E5E] leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E9E5C8] flex items-center justify-end text-xs font-mono text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                  <span className="inline-flex items-center gap-1 font-bold">
                    Read Essay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
