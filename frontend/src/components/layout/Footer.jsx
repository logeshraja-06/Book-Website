import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#181E33] text-[#F5F5DA] pt-20 pb-12 border-t border-[#E9E5C8]/20 selection:bg-[#212842] selection:text-[#F5F5DA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-[#E9E5C8]/15">
          
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#212842] border border-[#E9E5C8]/30 flex items-center justify-center text-[#F5F5DA]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial-serif text-2xl font-bold tracking-tight text-[#F5F5DA]">
                  BOOKVERSE
                </span>
                <span className="font-editorial-sans text-[10px] uppercase tracking-[0.2em] text-[#E9E5C8]/80 font-bold">
                  {t('footer.tagline')}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#FFFDF3]/80 font-sans">
              {t('footer.manifesto')}
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest font-mono text-[#E9E5C8]/60 font-semibold">
                {t('footer.designedFor')}
              </span>
            </div>
          </div>

          {/* Platform Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5DA] font-mono">{t('footer.platformHeading')}</h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF3]/80 font-sans">
              <li><Link to="/books" className="hover:text-[#F5F5DA] transition-colors">{t('footer.catalogOverview')}</Link></li>
              <li><Link to="/categories" className="hover:text-[#F5F5DA] transition-colors">{t('footer.genreTaxonomy')}</Link></li>
              <li><Link to="/authors" className="hover:text-[#F5F5DA] transition-colors">{t('footer.authorGuild')}</Link></li>
              <li><Link to="/about" className="hover:text-[#F5F5DA] transition-colors">{t('footer.platformPhilosophy')}</Link></li>
            </ul>
          </div>

          {/* Creators & Workspaces */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5DA] font-mono">{t('footer.workspacesHeading')}</h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF3]/80 font-sans">
              <li>
                <Link to="/my-shelf" className="inline-flex items-center gap-1.5 hover:text-[#F5F5DA] transition-colors font-medium">
                  {t('footer.myReadingShelf')} <ArrowUpRight className="w-3 h-3 text-[#384266]" />
                </Link>
              </li>
              <li>
                <Link to="/authors" className="inline-flex items-center gap-1.5 hover:text-[#F5F5DA] transition-colors font-medium">
                  {t('footer.authorIndex')} <ArrowUpRight className="w-3 h-3 text-[#384266]" />
                </Link>
              </li>
              <li><Link to="/about" className="hover:text-[#F5F5DA] transition-colors">{t('footer.publishingGuidelines')}</Link></li>
            </ul>
          </div>

          {/* Institutional / Internal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5DA] font-mono">{t('footer.colophonHeading')}</h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF3]/80 font-sans">
              <li><span className="text-[#E9E5C8]/70">{t('footer.versionLabel')}</span></li>
              <li><Link to="/about" className="hover:text-[#F5F5DA] transition-colors">{t('footer.editorialTerms')}</Link></li>
              <li>
                <Link to="/publisher/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E9E5C8]/90 hover:text-[#F5F5DA] transition-colors">
                  <Lock className="w-3 h-3 text-[#384266]" />
                  <span>{t('footer.publisherAccessPortal')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E9E5C8]/70 font-editorial-sans">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#F5F5DA] transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#F5F5DA] transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#F5F5DA] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
