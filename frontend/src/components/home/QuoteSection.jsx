import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function QuoteSection() {
  return (
    <section className="py-32 bg-[#FAF8F6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
        
        {/* Subtle Decorative Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] mx-auto flex items-center justify-center text-[#D3968C]"
        >
          <Quote className="w-5 h-5" />
        </motion.div>

        {/* Large Centered Pull Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#2B2B2B] leading-[1.25] font-normal tracking-tight"
        >
          "A book must be the axe for the frozen sea within us. Literature is not an accessory to life, but its very catalyst."
        </motion.blockquote>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-2"
        >
          <p className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
            Franz Kafka — Editorial Colophon
          </p>
        </motion.div>

      </div>
    </section>
  );
}
