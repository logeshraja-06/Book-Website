import { motion } from 'framer-motion';
import { Users, Eye, Clock, Award, BarChart2 } from 'lucide-react';

export default function AuthorAnalytics() {
  const stats = [
    { label: 'Total Readers', value: '12,450', sub: '+18% this month', icon: Users },
    { label: 'Total Views', value: '48,200', sub: 'Across 4 manuscripts', icon: Eye },
    { label: 'Avg Reading Time', value: '32 mins', sub: 'Per reading session', icon: Clock },
    { label: 'Completion Rate', value: '84%', sub: 'High engagement score', icon: Award },
  ];

  const monthlyReads = [
    { month: 'Jan', reads: 3200 },
    { month: 'Feb', reads: 4100 },
    { month: 'Mar', reads: 5800 },
    { month: 'Apr', reads: 7200 },
    { month: 'May', reads: 8900 },
    { month: 'Jun', reads: 11400 },
    { month: 'Jul', reads: 12450 },
  ];

  const maxReads = Math.max(...monthlyReads.map((m) => m.reads));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="border-b border-[#E7D9D3] pb-6 space-y-1">
        <span className="text-xs uppercase font-mono tracking-widest text-[#D3968C] font-semibold">
          Performance Insights
        </span>
        <h1 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
          Author Analytics
        </h1>
        <p className="text-xs font-mono text-[#6E6A67]">
          Quiet readership analytics for your published titles.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st) => {
          const Icon = st.icon;

          return (
            <div
              key={st.label}
              className="p-6 rounded-2xl bg-[#FAF8F6] border border-[#E7D9D3] space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-[#6E6A67]">
                <span className="text-xs font-mono uppercase tracking-wider">{st.label}</span>
                <Icon className="w-4 h-4 text-[#D3968C]" />
              </div>
              <div className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
                {st.value}
              </div>
              <p className="text-[11px] font-mono text-[#6E6A67] opacity-80">{st.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── ONE Clean SVG Reading Statistics Bar Chart ── */}
      <div className="p-8 rounded-3xl bg-[#FAF8F6] border border-[#E7D9D3] shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-4">
          <div>
            <h3 className="font-editorial-serif text-xl font-normal text-[#2B2B2B] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#D3968C]" />
              Monthly Readership Trend
            </h3>
            <p className="text-xs font-mono text-[#6E6A67]">Total unique reader sessions over 2026</p>
          </div>
          <span className="text-xs font-mono text-[#D3968C] font-semibold bg-[#E8C8C2]/30 px-3 py-1 rounded-full">
            +32% Growth
          </span>
        </div>

        {/* Clean SVG Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-64 flex items-end justify-between gap-4 sm:gap-8 px-4">
            {monthlyReads.map((m) => {
              const heightPercent = Math.round((m.reads / maxReads) * 100);

              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className="text-[10px] font-mono text-[#6E6A67] opacity-0 group-hover:opacity-100 transition-opacity">
                    {(m.reads / 1000).toFixed(1)}k
                  </div>

                  <div className="w-full max-w-[48px] bg-[#F4EEEA] rounded-t-xl overflow-hidden h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full bg-[#2B2B2B] group-hover:bg-[#D3968C] transition-colors rounded-t-xl"
                    />
                  </div>

                  <span className="text-xs font-mono text-[#2B2B2B] font-semibold">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
