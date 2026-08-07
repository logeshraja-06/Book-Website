import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'BookVerse Studio restored dignity to digital manuscript submission. Our works reach readers DRM-free without algorithmic noise or commercial friction.',
      author: 'Kalki Krishnamurthy',
      role: 'Historical Realism Author'
    },
    {
      quote:
        'The Editorial Control Center provides the exact craft tools an independent publishing house needs — precise, calm, and authoritative.',
      author: 'Arundhati Roy',
      role: 'Contributor & Essayist'
    },
    {
      quote:
        'As a reader, discovering literature here feels like stepping into a serene, highly curated archive where typography takes center stage.',
      author: 'Vikram Seth',
      role: 'Novelist & Poet'
    }
  ];

  return (
    <section className="py-24 bg-[#FAF8F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
            Literary Perspectives
          </span>
          <h2 className="font-editorial-serif text-4xl text-[#2B2B2B] font-normal">
            Voices from the Studio
          </h2>
        </div>

        {/* Large Serif Pull-Quote Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E7D9D3] shadow-sm flex flex-col justify-between hover:border-[#D3968C] transition-colors"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#D3968C]/40" />
                <blockquote className="font-editorial-serif text-lg italic text-[#2B2B2B] leading-relaxed">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E7D9D3]">
                <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">
                  {item.author}
                </h4>
                <p className="text-xs font-mono text-[#6E6A67]">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
