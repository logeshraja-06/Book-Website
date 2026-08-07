import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F4EEEA] border-t border-[#E7D9D3] text-[#6E6A67] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-[#E7D9D3]">
          
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF8F6] border border-[#E7D9D3] flex items-center justify-center text-[#2B2B2B]">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-editorial-serif text-2xl font-semibold text-[#2B2B2B]">
                BookVerse<span className="text-[#D3968C]">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#6E6A67]">
              BookVerse Studio is a digital publishing ecosystem crafted for authors, independent publishers, and discerning readers who cherish the art of literature.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest font-mono text-[#2B2B2B]/60">
                Designed for Editorial Excellence
              </span>
            </div>
          </div>

          {/* Platform Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2B2B2B]">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/books" className="hover:text-[#2B2B2B] transition-colors">Catalog Overview</Link></li>
              <li><Link to="/categories" className="hover:text-[#2B2B2B] transition-colors">Genre Taxonomy</Link></li>
              <li><Link to="/authors" className="hover:text-[#2B2B2B] transition-colors">Author Directory</Link></li>
              <li><Link to="/about" className="hover:text-[#2B2B2B] transition-colors">Platform Philosophy</Link></li>
            </ul>
          </div>

          {/* Creators & Workspaces */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2B2B2B]">Workspaces</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/author/dashboard" className="inline-flex items-center gap-1.5 hover:text-[#2B2B2B] transition-colors text-[#2B2B2B] font-medium">
                  Author Portal <ArrowUpRight className="w-3 h-3 text-[#D3968C]" />
                </Link>
              </li>
              <li>
                <Link to="/my-shelf" className="inline-flex items-center gap-1.5 hover:text-[#2B2B2B] transition-colors text-[#2B2B2B] font-medium">
                  My Shelf Reader Portal <ArrowUpRight className="w-3 h-3 text-[#D3968C]" />
                </Link>
              </li>
              <li><Link to="/about" className="hover:text-[#2B2B2B] transition-colors">Publishing Guidelines</Link></li>
            </ul>
          </div>

          {/* Institutional / Internal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2B2B2B]">Colophon & Access</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-[#6E6A67]">Version 1.0 (V1 Release)</span></li>
              <li><Link to="/about" className="hover:text-[#2B2B2B] transition-colors">Editorial Terms</Link></li>
              <li>
                <Link to="/publisher/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6E6A67] hover:text-[#2B2B2B] transition-colors">
                  <Lock className="w-3 h-3 text-[#D3968C]" />
                  <span>Publisher / Internal Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BookVerse Studio Inc. All rights reserved. Built with editorial intention.</p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#2B2B2B] transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#2B2B2B] transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#2B2B2B] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
