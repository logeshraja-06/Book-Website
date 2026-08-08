import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, Feather, Sparkles } from 'lucide-react';

export default function WhyBookVerse() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Thoughtfully Curated',
      desc: 'Every manuscript undergoes rigorous evaluation by our editorial board for intellectual rigor, narrative craft, and enduring cultural resonance.'
    },
    {
      icon: ShieldCheck,
      title: 'DRM-Free Integrity',
      desc: 'Readers own perpetual digital rights to their acquired books without restrictive DRM locks, intrusive ads, or revocable cloud licenses.'
    },
    {
      icon: Feather,
      title: 'Sovereign Author Rights',
      desc: 'Writers retain full intellectual ownership and direct connections with their reading audience, backed by transparent publishing pipelines.'
    }
  ];

  return (
    <section className="py-24 bg-[#F5F5DA] border-b border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#7B021D] font-bold block">
            Our Publishing Ethos
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-5xl text-[#211D1D] font-normal">
            Why BookVerse Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E5E] font-sans leading-relaxed">
            Reimagining digital publishing from first principles to restore dignity, intentionality, and craftsmanship to literature.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FFFDF3] rounded-3xl p-8 border border-[#E9E5C8] space-y-4 shadow-2xs hover:border-[#7B021D] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5DA] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-editorial-serif text-2xl font-bold text-[#211D1D]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E5E] font-sans leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
