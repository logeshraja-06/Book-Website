import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen, Compass } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section className="py-24 bg-[#E8C8C2]/30 border-t border-[#E7D9D3] relative overflow-hidden">
      
      {/* Soft Ambient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D3968C]/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="bg-[#FFFFFF] rounded-3xl p-10 sm:p-16 border border-[#E7D9D3] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Statement */}
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
              Begin Your Journey
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#2B2B2B] leading-tight font-normal">
              Whether you come to read or to write, your sanctuary is ready.
            </h2>
            <p className="text-base text-[#6E6A67] max-w-xl leading-relaxed">
              Join thousands of readers discovering uncompromised literature, and authors publishing through our specialized <span className="text-[#2B2B2B] font-semibold">Writing Studio</span>.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            
            {/* Reader CTA */}
            <a
              href="#featured"
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-sm font-semibold tracking-wide hover:bg-[#D3968C] transition-all duration-300 shadow-md group"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore The Library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Writer CTA */}
            <Link
              to="/author"
              className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-[#2B2B2B] text-sm font-medium hover:border-[#D3968C] hover:bg-[#FAF8F6] transition-all duration-300"
            >
              <Feather className="w-4 h-4 text-[#D3968C]" />
              <span>Start Writing on BookVerse</span>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
