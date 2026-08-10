import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen, Sparkles, Shield, Compass, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  const tenets = [
    {
      num: '01',
      title: t('about.tenet1Title'),
      desc: t('about.tenet1Desc')
    },
    {
      num: '02',
      title: t('about.tenet2Title'),
      desc: t('about.tenet2Desc')
    },
    {
      num: '03',
      title: t('about.tenet3Title'),
      desc: t('about.tenet3Desc')
    },
    {
      num: '04',
      title: t('about.tenet4Title'),
      desc: t('about.tenet4Desc')
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
    <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D] selection:bg-[#212842] selection:text-[#F5F5DA]">
      
      {/* ── 1. MISSION HERO STATEMENT ── */}
      <section className="py-24 lg:py-32 bg-[#F5F5DA] border-b border-[#E9E5C8]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#212842] text-xs font-mono uppercase tracking-widest font-bold shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
            <span>{t('about.manifestoBadge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-editorial-serif text-4xl sm:text-6xl lg:text-7xl text-[#211D1D] font-normal leading-[1.12] tracking-tight"
          >
            {t('about.heroTitlePart1')} <span className="italic font-normal text-[#212842]">{t('about.heroTitleItalic')}</span>{t('about.heroTitlePart2')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B5E5E] max-w-2xl mx-auto leading-relaxed font-sans"
          >
            {t('about.heroSubtitle')}
          </motion.p>

        </div>
      </section>

      {/* ── 2. HIGH-IMPACT MANIFESTO (DEEP BURGUNDY FULL-BLEED BAND) ── */}
      <section className="py-20 bg-[#181E33] text-[#F5F5DA] relative overflow-hidden border-y border-[#E9E5C8]/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#E9E5C8]/80 font-bold block">
              {t('about.ethosEyebrow')}
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-5xl text-[#F5F5DA] font-normal leading-tight">
              {t('about.ethosHeading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#FFFDF3]/15">
            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">100%</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">{t('about.statDrmTitle')}</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                {t('about.statDrmDesc')}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">Zero</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">{t('about.statNoiseTitle')}</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                {t('about.statNoiseDesc')}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-editorial-serif text-4xl font-bold text-[#F5F5DA] block">14+</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#E9E5C8] font-bold">{t('about.statImprintsTitle')}</h4>
              <p className="text-xs text-[#FFFDF3]/80 leading-relaxed font-sans">
                {t('about.statImprintsDesc')}
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
              <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block">
                {t('about.originEyebrow')}
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1D] font-normal leading-tight">
                {t('about.originHeading')}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base text-[#6B5E5E] leading-[1.8] font-sans">
              <blockquote className="font-editorial-serif text-xl sm:text-2xl text-[#211D1D] italic border-l-2 border-[#212842] pl-6 py-1">
                "{t('about.originQuote')}"
              </blockquote>

              <p>
                {t('about.originPara1')}
              </p>

              <p>
                {t('about.originPara2Prefix')} <strong className="text-[#211D1D]">{t('about.originPara2Studio')}</strong>{t('about.originPara2Mid')} <strong className="text-[#211D1D]">{t('about.originPara2Workspace')}</strong>{t('about.originPara2Suffix')}
              </p>

              <div className="pt-6 grid grid-cols-2 gap-6 border-t border-[#E9E5C8]">
                <div className="bg-[#FFFDF3] p-5 rounded-2xl border border-[#E9E5C8] shadow-2xs">
                  <span className="font-editorial-serif text-3xl font-bold text-[#211D1D] block">12,000+</span>
                  <span className="text-[11px] font-mono uppercase text-[#212842] font-bold block mt-1">{t('about.statArchivedWorks')}</span>
                </div>
                <div className="bg-[#FFFDF3] p-5 rounded-2xl border border-[#E9E5C8] shadow-2xs">
                  <span className="font-editorial-serif text-3xl font-bold text-[#211D1D] block">4.9 ★</span>
                  <span className="text-[11px] font-mono uppercase text-[#212842] font-bold block mt-1">{t('about.statReaderSatisfaction')}</span>
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#181E33]/90 via-[#212842]/85 to-[#181E33]/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-mono text-[#E9E5C8] font-bold block mb-2">
              {t('about.tenetsEyebrow')}
            </span>
            <h2 className="font-editorial-serif text-4xl text-[#FFFDF3] font-normal">
              {t('about.tenetsHeading')}
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
              <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block mb-2">
                {t('about.boardEyebrow')}
              </span>
              <h2 className="font-editorial-serif text-4xl text-[#211D1D] font-normal">
                {t('about.boardHeading')}
              </h2>
            </div>
            <p className="text-xs font-mono text-[#6B5E5E]">
              {t('about.boardSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipGuild.map((member) => (
              <div
                key={member.name}
                className="bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-2xs hover:shadow-xl hover:shadow-[#181E33]/[0.06] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9E5C8]"
                  />
                  <div>
                    <h4 className="font-editorial-serif text-xl font-bold text-[#211D1D]">{member.name}</h4>
                    <span className="text-xs font-editorial-sans text-[#212842] font-bold block">{member.role}</span>
                  </div>
                  <p className="text-xs text-[#6B5E5E] leading-relaxed font-sans">
                    "{member.bio}"
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E9E5C8] text-[10px] font-mono text-[#6B5E5E] uppercase tracking-widest">
                  {t('about.boardFooterLabel')}
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
            <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold">
              {t('about.ctaEyebrow')}
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#211D1D] font-normal leading-tight">
              {t('about.ctaHeading')}
            </h2>
            <p className="text-sm text-[#6B5E5E] max-w-lg mx-auto font-sans leading-relaxed">
              {t('about.ctaSubtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/books"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('about.ctaExploreCatalogue')}</span>
            </Link>
            <Link
              to="/authors"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] text-xs font-bold uppercase tracking-wider hover:border-[#212842] transition-colors flex items-center justify-center gap-2"
            >
              <Feather className="w-4 h-4 text-[#212842]" />
              <span>{t('about.ctaMeetGuild')}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
