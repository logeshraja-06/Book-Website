import { motion } from 'framer-motion';
import { READER_PROFILE } from '../../data/mockReaderData';
import { Feather, Edit2, ShieldCheck, Sparkles } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="space-y-12 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            Reading Identity & Profile
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            Your personal reader passport and preference settings
          </p>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="bg-[#FFFFFF] rounded-2xl p-8 lg:p-10 border border-[#E7D9D3] shadow-sm space-y-10">
        
        {/* Avatar & Bio Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b border-[#E7D9D3] pb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7D9D3] shrink-0">
            <img
              src={READER_PROFILE.avatarUrl}
              alt={READER_PROFILE.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
                  {READER_PROFILE.name}
                </h3>
                <span className="text-xs font-mono text-[#D3968C] font-semibold">
                  {READER_PROFILE.handle}
                </span>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] hover:border-[#D3968C] transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p className="text-sm text-[#6E6A67] leading-relaxed max-w-xl">
              "{READER_PROFILE.bio}"
            </p>
          </div>
        </div>

        {/* Typographic Reading Stats (Pure Typography Rhythm, No Dashboard Cards!) */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
            Reader Metrics
          </span>
          <div className="py-4 border-y border-[#E7D9D3] flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-mono text-[#6E6A67]">
            <div>
              <strong className="font-editorial-serif text-2xl text-[#2B2B2B] block">
                {READER_PROFILE.stats.booksRead}
              </strong>
              <span>Books Read</span>
            </div>
            <span className="text-[#E7D9D3] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#2B2B2B] block">
                {READER_PROFILE.stats.pagesCompleted}
              </strong>
              <span>Pages Completed</span>
            </div>
            <span className="text-[#E7D9D3] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#2B2B2B] block">
                {READER_PROFILE.stats.currentStreak}
              </strong>
              <span>Active Reading Streak</span>
            </div>
            <span className="text-[#E7D9D3] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#2B2B2B] block">
                {READER_PROFILE.stats.memberSince}
              </strong>
              <span>Member Since</span>
            </div>
          </div>
        </div>

        {/* Favorite Genres (Accent-Light Pill Styling) */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
            Preferred Genres
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {READER_PROFILE.favoriteGenres.map((genre) => (
              <span
                key={genre}
                className="px-4 py-2 rounded-full bg-[#E8C8C2]/30 border border-[#E7D9D3] text-xs font-semibold text-[#2B2B2B] font-mono tracking-wider"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Account Security & Privacy Statement */}
        <div className="p-6 rounded-2xl bg-[#F4EEEA]/70 border border-[#E7D9D3] flex items-center justify-between text-xs text-[#6E6A67]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D3968C]" />
            <span>Private Personal Shelf — DRM Free & Distraction-Free Reading Mode</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-[#2B2B2B]">Active Session</span>
        </div>

      </div>

    </div>
  );
}
