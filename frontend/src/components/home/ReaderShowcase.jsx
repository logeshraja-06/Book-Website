import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ZoomIn, Type, Sun, Bookmark, ArrowRight } from 'lucide-react';
import DigitalReaderModal from '../book/DigitalReaderModal';
import { BOOKS } from '../../data/booksData';

export default function ReaderShowcase() {
  const [demoReaderOpen, setDemoReaderOpen] = useState(false);
  const sampleBook = BOOKS[0]; // Ponniyin Selvan or Psychology of Money

  return (
    <section className="py-24 bg-[#FFFDF3] border-b border-[#E9E5C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#7B021D] font-bold block">
            Digital Craftsmanship
          </span>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#211D1D] font-normal tracking-tight">
            Read like you're holding the book.
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E5E] font-sans leading-relaxed">
            Our custom-engineered digital reader respects the cadence of classical typography. Enjoy isolated font scaling, smart reading zoom modes, paper-tinted themes, and automatic page synchronization.
          </p>
        </div>

        {/* Reader Interface Mockup Showcase */}
        <div className="relative rounded-3xl bg-[#F5F5DA] border border-[#E9E5C8] p-6 sm:p-12 shadow-xl overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Feature Points */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D] shrink-0 font-bold">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">Smart Reading Zoom</h3>
                    <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed mt-1">
                      Five precision zoom modes including Fit to Screen, Fit Width, and Comfortable Reading without browser distortion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D] shrink-0 font-bold">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">Editorial Typography</h3>
                    <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed mt-1">
                      Select between Cormorant Garamond, Lora, Libre Baskerville, and EB Garamond with isolated font size controls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#7B021D] shrink-0 font-bold">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">Persistent Progress</h3>
                    <p className="text-xs text-[#6B5E5E] font-sans leading-relaxed mt-1">
                      Your reading position, bookmarks, and quotes sync seamlessly to MongoDB across all personal devices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setDemoReaderOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-editorial-sans font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md group"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Reader Showcase</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Mockup Preview Frame */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-4 text-xs font-mono text-[#6B5E5E]">
                  <span className="font-bold text-[#211D1D]">BookVerse Digital Reader — Interactive Preview</span>
                  <span>Page 42 of 280</span>
                </div>

                <div className="space-y-4 font-editorial-serif text-base text-[#211D1D] leading-relaxed">
                  <h4 className="text-2xl font-bold text-[#7B021D]">Chapter III: The Rhythm of Craft</h4>
                  <p>
                    "To read a book carefully is to invite its author into the quiet chambers of one's own mind. In an age of relentless digital chatter, literature offers a tranquil sanctuary for sustained contemplation."
                  </p>
                  <p className="text-xs text-[#6B5E5E] font-sans italic border-l-2 border-[#7B021D] pl-4 py-1">
                    BookVerse Studio digital edition · DRM-free perpetual reading right.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9E5C8] flex items-center justify-between text-xs font-mono text-[#6B5E5E]">
                  <span>100% Responsive Engine</span>
                  <span className="text-[#7B021D] font-bold">15% Completed</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Demo Digital Reader Modal */}
      {demoReaderOpen && (
        <DigitalReaderModal
          isOpen={demoReaderOpen}
          onClose={() => setDemoReaderOpen(false)}
          book={sampleBook}
          initialPage={42}
        />
      )}
    </section>
  );
}
