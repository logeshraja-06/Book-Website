import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section className="py-20 bg-[#F5F5DA] border-t border-[#E9E5C8]">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-[#212842] font-bold">
            Literary Dispatch
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#211D1D] font-normal">
            Subscribe to the BookVerse Gazette
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E5E] max-w-lg mx-auto leading-relaxed">
            Receive monthly curated manuscript dispatches, author essays, and DRM-free catalog releases. No spam, ever.
          </p>
        </div>

        {/* Form Band */}
        {isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] max-w-md mx-auto flex items-center justify-center gap-2 text-xs font-mono text-[#211D1D]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#212842]" />
            <span>Subscribed! Check your inbox for our monthly literary dispatch.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E5E]" />
              <input
                type="email"
                required
                placeholder="Enter your email address…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-xs text-[#211D1D] placeholder-[#6B5E5E]/60 focus:outline-none focus:border-[#212842] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shrink-0 min-h-[44px]"
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
