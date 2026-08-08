import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen, Sparkles, Shield, Compass, Award } from 'lucide-react';

export default function AboutPage() {
  const tenets = [
    {
      num: '01',
      title: 'Editorial Primacy & Craftsmanship',
      desc: 'We treat every manuscript as a piece of enduring craftsmanship. Layouts, typography, and optical spacing are designed to respect the cadence and voice of the author.'
    },
    {
      num: '02',
      title: 'Sovereign Author Ownership',
      desc: 'Authors retain complete intellectual ownership and direct reader connections. We eliminate predatory DRM locks, complex rights lock-ins, and artificial marketplace barriers.'
    },
    {
      num: '03',
      title: 'Sanctuary Space for Deep Focus',
      desc: 'No pop-up ads, no algorithmic outrage bait, no notification clutter. BookVerse Studio is a serene digital sanctuary built for contemplation, scholarship, and sustained reading.'
    },
    {
      num: '04',
      title: 'Interconnected Publishing Ecosystem',
      desc: 'Readers, Authors, and Publishers operate in one seamless studio—creating a transparent, high-trust loop from initial draft concept to hardcover publication.'
    }
  ];

  const leadershipGuild = [
    {
      name: 'Dr. Ananya Varma',
      role: 'Chief Editorial Director',
      bio: 'Former chair of comparative literature at Oxford, specializing in 10th-century Chola maritime chronicles and dynastic historical fiction.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Head of Typography & Imprints',
      bio: 'Pioneer of variable font design and digital editorial architecture. Crafting reading systems for over 15 years.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Kavitha Sundaram',
      role: 'Curator, Classical Tamil Guild',
      bio: 'Literary historian dedicated to preserving ancient Sangam poetry, Chola epics, and contemporary Tamil pastoral literature.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D] selection:bg-[#7B021D] selection:text-[#F5F5DA]">
      
      {/* ── 1. MISSION HERO STATEMENT ── */}
      <section className="py-24 lg:py-32 bg-[#F5F5DA] border-b border-[#E9E5C8]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#7B021D] text-xs font-mono uppercase tracking-widest font-bold shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7B021D]" />
            <span>The BookVerse Manifesto</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-editorial-serif text-4xl sm:text-6xl lg:text-7xl text-[#211D1D] font-normal leading-[1.12] tracking-tight"
          >
            We believe literature is an <span className="italic font-normal text-[#7B021D]">architect of culture</span>, not a commodity of consumption.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B5E5E] max-w-2xl mx-auto leading-relaxed font-sans"
          >
            BookVerse Studio was built to restore dignity, intentionality, and sovereign author rights to modern digital publishing.
          </motion.p>

        </div>
      </section>

      {/* ── 2. HIGH-IMPACT MANIFESTO (DEEP BURGUNDY FULL-BLEED BAND) ── */}
      <section className="py-20 bg-[#520014] text-[#F5F5DA] relative overflow-hidden border-y border-[#E9E5C8]/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#E9E5C8]/80 font-bold block">
              Editorial Ethos
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-5xl text-[#F5F5DA] font-normal leading-tight">
              Crafted for those who write with authority and read with devotion.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#FFFDF3]/15">
            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">100%</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">DRM-Free Integrity</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                Readers retain true digital ownership of their library. No revokable cloud licenses.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">Zero</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">Algorithmic Noise</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                No clickbait recommendations or ad popups. Pure narrative typography.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">14+</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">Curated Imprints</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                Spanning classical Tamil historical epics, behavioral economics, and deep work systems.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. ORIGIN STORY & EDITORIAL PHILOSOPHY ── */}
      <section className="py-24 bg-[#F5F5DA] border-b border-[#E9E5C8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
              <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
                Our Origin Story
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1D] font-normal leading-tight">
                Why we built a new digital publishing sanctuary.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base text-[#6B5E5E] leading-[1.8] font-sans">
              <blockquote className="font-editorial-serif text-xl sm:text-2xl text-[#211D1D] italic border-l-2 border-[#7B021D] pl-6 py-1">
                "The modern web fragmented the sacred relationship between those who write and those who read."
              </blockquote>

              <p>
                In an era dominated by rapid content feeds and algorithmic engagement hacks, long-form literature was pushed into clunky e-readers and restrictive marketplace walled gardens. Authors surrendered significant royalties while readers received homogenized templates.
              </p>

              <p>
                BookVerse Studio was created as an antidote. We reimagined the digital publishing stack from first principles: giving authors a bespoke <strong className="text-[#211D1D]">Writing Studio</strong>, empowering publishers with an <strong className="text-[#211D1D]">Editorial Workspace</strong>, and offering readers a tranquil catalog crafted with luxury editorial typography.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-6 border-t border-[#E9E5C8]">
                <div className="bg-[#FFFDF3] p-5 rounded-2xl border border-[#E9E5C8] shadow-2xs">
                  <span className="font-editorial-serif text-3xl font-bold text-[#211D1D] block">12,000+</span>
                  <span className="text-[11px] font-mono uppercase text-[#7B021D] font-bold block mt-1">Archived Works</span>
                </div>
                <div className="bg-[#FFFDF3] p-5 rounded-2xl border border-[#E9E5C8] shadow-2xs">
                  <span className="font-editorial-serif text-3xl font-bold text-[#211D1D] block">4.9 ★</span>
                  <span className="text-[11px] font-mono uppercase text-[#7B021D] font-bold block mt-1">Reader Satisfaction</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. FOUNDATIONAL TENETS ── */}
      <section className="relative py-24 border-b border-[#E9E5C8] overflow-hidden">
        {/* Full background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        {/* Brand Burgundy/Crimson Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#520014]/90 via-[#7B021D]/85 to-[#520014]/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-mono text-[#E9E5C8] font-bold block mb-2">
              Foundational Principles
            </span>
            <h2 className="font-editorial-serif text-4xl text-[#FFFDF3] font-normal">
              The Tenets of BookVerse Studio
            </h2>
          </div>

          <div className="divide-y divide-[#FFFDF3]/20 border-y border-[#FFFDF3]/20">
            {tenets.map((v) => (
              <div key={v.num} className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group">
                <div className="md:col-span-4 space-y-1">
                  <span className="font-mono text-xs text-[#E9E5C8] font-bold block">{v.num}</span>
                  <h3 className="font-editorial-serif text-2xl font-bold text-[#FFFDF3] group-hover:text-[#E9E5C8] transition-colors">
                    {v.title}
                  </h3>
                </div>
                <div className="md:col-span-8">
                  <p className="text-sm sm:text-base text-[#E9E5C8]/85 leading-relaxed max-w-2xl font-sans">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. EDITORIAL BOARD & GUILD ── */}
      <section className="py-24 bg-[#F5F5DA] border-b border-[#E9E5C8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block mb-2">
                Editorial Board
              </span>
              <h2 className="font-editorial-serif text-4xl text-[#211D1D] font-normal">
                Leadership & Imprint Curators
              </h2>
            </div>
            <p className="text-xs font-mono text-[#6B5E5E]">
              Guiding manuscript reviews and catalog preservation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipGuild.map((member) => (
              <div
                key={member.name}
                className="bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-2xs hover:shadow-xl hover:shadow-[#520014]/[0.06] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9E5C8]"
                  />
                  <div>
                    <h4 className="font-editorial-serif text-xl font-bold text-[#211D1D]">{member.name}</h4>
                    <span className="text-xs font-editorial-sans text-[#7B021D] font-bold block">{member.role}</span>
                  </div>
                  <p className="text-xs text-[#6B5E5E] leading-relaxed font-sans">
                    "{member.bio}"
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E9E5C8] text-[10px] font-mono text-[#6B5E5E] uppercase tracking-widest">
                  Studio Editorial Board
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. CLOSING CALL TO ACTION ── */}
      <section className="py-24 bg-[#F5F5DA]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold">
              Join the Ecosystem
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#211D1D] font-normal leading-tight">
              Ready to publish or discover your next seminal work?
            </h2>
            <p className="text-sm text-[#6B5E5E] max-w-lg mx-auto font-sans leading-relaxed">
              Whether you are an author seeking sovereign publication or a reader searching for uncompromised literature, your sanctuary is ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/books"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore The Catalogue</span>
            </Link>
            <Link
              to="/authors"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] text-xs font-bold uppercase tracking-wider hover:border-[#7B021D] transition-colors flex items-center justify-center gap-2"
            >
              <Feather className="w-4 h-4 text-[#7B021D]" />
              <span>Meet Author Guild</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
