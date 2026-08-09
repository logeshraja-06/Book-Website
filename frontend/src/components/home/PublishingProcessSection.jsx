import { motion } from 'framer-motion';

export default function PublishingProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Offline Submission',
      desc: 'Authors upload completed manuscript files (PDF/DOCX/EPUB) and cover artwork via the Author Portal.'
    },
    {
      num: '02',
      title: 'Editorial Control Review',
      desc: 'Internal publisher editors evaluate narrative craftsmanship, metadata accuracy, and catalog fit.'
    },
    {
      num: '03',
      title: 'Catalog Indexing',
      desc: 'Approved manuscripts are assigned ISBN identifiers and placed into our high-typography registry.'
    },
    {
      num: '04',
      title: 'Reader Discovery',
      desc: 'Readers discover, sample, and acquire DRM-free literature across web and personal shelf modules.'
    }
  ];

  return (
    <section className="py-24 bg-[#F5F5DA] border-y border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-2">
              Publishing Pipeline
            </span>
            <h2 className="font-editorial-serif text-4xl text-[#211D1D] font-normal tracking-tight">
              From Manuscript to Catalog
            </h2>
          </div>
          <p className="text-sm text-[#6B5E5E] max-w-md font-mono">
            A quiet, 4-stage editorial journey designed for literary integrity.
          </p>
        </div>

        {/* Typographic Process Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-4 pt-6 border-t border-[#E9E5C8] hover:border-[#212842] transition-colors group"
            >
              <span className="font-editorial-serif text-3xl font-light text-[#212842] group-hover:text-[#181E33] transition-colors">
                {step.num}
              </span>
              <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
                {step.title}
              </h3>
              <p className="text-xs text-[#6B5E5E] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
