import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      num: '01',
      title: 'Editorial Primacy',
      desc: 'We treat every manuscript as a piece of enduring craftsmanship. Layouts, typography, and spacing are designed to respect the cadence of the author’s voice.'
    },
    {
      num: '02',
      title: 'Sovereign Authorship',
      desc: 'Authors retain complete intellectual ownership and direct reader connection. We eliminate predatory DRM fees, complex rights lock-ins, and artificial platform barriers.'
    },
    {
      num: '03',
      title: 'Distraction-Free Reading',
      desc: 'No pop-ups, no algorithmic outrage bait, no flashy notifications. BookVerse Studio is sanctuary space built for deep focus, contemplation, and sustained reading.'
    },
    {
      num: '04',
      title: 'Interconnected Ecosystem',
      desc: 'Readers, Authors, Publishers, and Admins operate in one unified space—creating a transparent loop from draft concept to hardcover release.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      
      {/* ── Mission Hero Statement ── */}
      <section className="py-24 lg:py-32 bg-[#FAF8F6] border-b border-[#E7D9D3]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#6E6A67] text-xs font-mono uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D3968C]" />
            <span>The BookVerse Manifesto</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-editorial-serif text-4xl sm:text-6xl lg:text-7xl text-[#2B2B2B] font-normal leading-[1.12] tracking-tight"
          >
            We believe literature is an <span className="italic font-light text-[#C98579]">architect of culture</span>, not a commodity of consumption.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#6E6A67] max-w-2xl mx-auto leading-relaxed"
          >
            Founded in 2026, BookVerse Studio was built to restore elegance, intentionality, and sovereign author rights to digital publishing.
          </motion.p>

        </div>
      </section>

      {/* ── Narrative Philosophy (Asymmetric 2-Column Copy) ── */}
      <section className="py-24 bg-[#F4EEEA] border-b border-[#E7D9D3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
                Our Origin Story
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal">
                Why we built a new digital publishing sanctuary.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base text-[#6E6A67] leading-[1.8]">
              <p className="font-editorial-serif text-xl text-[#2B2B2B] italic">
                "The modern web fragmented the sacred relationship between those who write and those who read."
              </p>

              <p>
                In an era dominated by rapid content feeds and algorithmic engagement hacks, long-form literature was pushed into clunky e-readers and restrictive marketplace walled gardens. Authors surrendered significant royalties while readers received homogenized templates.
              </p>

              <p>
                BookVerse Studio was created as an antidote. We reimagined the digital publishing stack from first principles: giving authors a bespoke <strong className="text-[#2B2B2B]">Writing Studio</strong>, empowering publishers with an <strong className="text-[#2B2B2B]">Editorial Workspace</strong>, and offering readers a tranquil catalog crafted with high-fashion typographic hierarchy.
              </p>

              <div className="pt-4 flex items-center gap-8 border-t border-[#E7D9D3]">
                <div>
                  <span className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] block">100%</span>
                  <span className="text-xs font-mono uppercase text-[#6E6A67]">Independent</span>
                </div>
                <div className="h-8 w-px bg-[#E7D9D3]" />
                <div>
                  <span className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] block">₹0</span>
                  <span className="text-xs font-mono uppercase text-[#6E6A67]">DRM Friction</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Quiet Values Section (Textual List, No Card Grids) ── */}
      <section className="py-24 bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="mb-16">
            <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-2">
              Foundational Tenets
            </span>
            <h2 className="font-editorial-serif text-4xl text-[#2B2B2B] font-normal">
              Principles of BookVerse Studio
            </h2>
          </div>

          <div className="divide-y divide-[#E7D9D3] border-y border-[#E7D9D3]">
            {values.map((v) => (
              <div key={v.num} className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-3">
                  <span className="font-mono text-sm text-[#D3968C] font-semibold block">{v.num}</span>
                  <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B] mt-1">{v.title}</h3>
                </div>
                <div className="md:col-span-9">
                  <p className="text-base text-[#6E6A67] leading-relaxed max-w-2xl">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer Band */}
          <div className="mt-20 pt-12 border-t border-[#E7D9D3] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-editorial-serif text-2xl text-[#2B2B2B]">Ready to join our publishing ecosystem?</h3>
              <p className="text-sm text-[#6E6A67] mt-1">Whether you are an author or an independent press, your workspace awaits.</p>
            </div>
            <Link
              to="/author"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shrink-0"
            >
              <span>Start Writing Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
