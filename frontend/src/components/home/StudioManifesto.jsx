import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function ManifestoStat({ target, prefix = '', suffix = '', decimals = 0, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (decimals > 0) {
            setDisplayValue(latest.toFixed(decimals));
          } else {
            setDisplayValue(Math.floor(latest).toLocaleString('en-IN'));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, decimals, motionVal]);

  return (
    <div ref={ref} className="space-y-1">
      <span className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#211D1D] block tracking-tight">
        {prefix}{displayValue}{suffix}
      </span>
      <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B5E5E] font-bold block">
        {label}
      </span>
    </div>
  );
}

export default function StudioManifesto() {
  const { t } = useTranslation();

  return (
    <section className="py-24 sm:py-28 lg:py-32 bg-[#F5F5DA] border-b border-[#E9E5C8]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-10">
        <Quote className="w-6 h-6 text-[#212842]/40 mx-auto" />
        <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block">
          {t('home.manifesto.eyebrow')}
        </span>
        <motion.blockquote
          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1D] leading-[1.3] font-normal italic"
        >
          "{t('home.manifesto.quote')}"
        </motion.blockquote>

        <div className="flex items-center justify-center gap-10 sm:gap-16 pt-6">
          <ManifestoStat target={14} suffix="+" label={t('home.manifesto.statImprints')} />
          <div className="h-10 w-px bg-[#E9E5C8]" />
          <ManifestoStat decimals={1} target={4.9} suffix="★" label={t('home.manifesto.statRating')} />
          <div className="h-10 w-px bg-[#E9E5C8]" />
          <ManifestoStat target={100} suffix="%" label={t('home.manifesto.statDrmFree')} />
        </div>
      </div>
    </section>
  );
}
