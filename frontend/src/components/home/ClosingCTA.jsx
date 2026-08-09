import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section className="py-24 bg-[#F5F5DA] border-t border-[#E9E5C8] relative overflow-hidden">
      
      {/* Soft Ambient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#212842]/[0.06] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="bg-[#FFFDF3] rounded-3xl p-10 sm:p-16 border border-[#E9E5C8] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Statement */}
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold block">
              Begin Your Journey
            </span>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl text-[#211D1D] leading-tight font-normal">
              Whether you come to read or to publish, your literary sanctuary is ready.
            </h2>
            <p className="text-base text-[#6B5E5E] max-w-xl leading-relaxed">
              Join thousands of readers discovering uncompromised literature, and authors publishing through our specialized <span className="text-[#211D1D] font-semibold">Writing Studio</span>.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            
            {/* Reader CTA */}
            <Link
              to="/books"
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#212842] text-[#F5F5DA] text-sm font-bold tracking-wide hover:bg-[#181E33] transition-all duration-300 shadow-md group"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore The Library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Writer CTA */}
            <Link
              to="/authors"
              className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-[#211D1D] text-sm font-medium hover:border-[#212842] hover:bg-[#FFFDF3] transition-all duration-300"
            >
              <Feather className="w-4 h-4 text-[#212842]" />
              <span>Discover Author Guild</span>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
