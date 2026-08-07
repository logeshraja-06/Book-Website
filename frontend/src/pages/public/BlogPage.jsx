import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Feather } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      id: 'drm-free-integrity',
      title: 'The Architecture of DRM-Free Digital Books',
      author: 'Kalki Krishnamurthy',
      date: 'August 14, 2025',
      readTime: '4 min read',
      excerpt: 'Why digital literature ownership matters in an era of revokable cloud licenses.',
      content: `Digital rights management (DRM) was originally conceived to prevent unauthorized distribution. However, in practice, it places artificial restrictions on readers who have legitimately acquired literature. At BookVerse Studio, manuscripts are rendered DRM-free. When a reader purchases a hardcover or digital edition, they own a perpetual license to read, archive, and cherish that text across any open device without proprietary vendor lock-in.`
    },
    {
      id: 'historical-realism',
      title: 'On Historical Realism in Modern Indian Literature',
      author: 'Arundhati Roy',
      date: 'July 28, 2025',
      readTime: '6 min read',
      excerpt: 'Tracing dynastic narratives from 10th-century Tanjore to contemporary historical epics.',
      content: `Historical fiction is not merely costume drama; it is narrative architecture applied to cultural memory. Reconstructing 7th-century Kanchi or 10th-century Thanjavur requires balancing archaeological accuracy with emotional authenticity. Through independent editorial oversight, authors can explore complex geopolitical conflicts without corporate editorial dilution.`
    },
    {
      id: 'typography-in-publishing',
      title: 'Why Typography Matters More Than Metadata in Publishing',
      author: 'Vikram Seth',
      date: 'June 19, 2025',
      readTime: '5 min read',
      excerpt: 'How optical margins, line length, and typeface selection dictate narrative comprehension.',
      content: `A book's visual rhythm dictates how deeply a reader enters the text. When typefaces are selected for optical harmony rather than dense screen compression, reading fatigue dissolves. Generous margins, restrained scale hierarchies, and editorial serif headlines create the calm atmosphere essential for contemplative literature.`
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F6] py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b border-[#E7D9D3] pb-8">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
            BookVerse Gazette & Journal
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] font-normal">
            Essays on Publishing & Craft
          </h1>
          <p className="text-sm text-[#6E6A67] max-w-xl leading-relaxed">
            Explorations into DRM-free literature, typography craft, historical narrative architecture, and independent author control.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-12 divide-y divide-[#E7D9D3]">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="pt-10 first:pt-0 space-y-4"
            >
              <div className="flex items-center gap-3 text-xs font-mono text-[#6E6A67]">
                <span>{post.date}</span>
                <span>·</span>
                <span>By {post.author}</span>
                <span>·</span>
                <span className="text-[#D3968C] font-semibold">{post.readTime}</span>
              </div>

              <h2 className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
                {post.title}
              </h2>

              <p className="text-base text-[#6E6A67] leading-relaxed">
                {post.content}
              </p>
            </motion.article>
          ))}
        </div>

      </div>
    </div>
  );
}
