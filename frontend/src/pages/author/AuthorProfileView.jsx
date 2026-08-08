import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Globe, Share2, Camera, Save, CheckCircle2, ShieldCheck, Sparkles, Feather, AlertCircle } from 'lucide-react';
import { useAuth, apiFetch } from '../../context/AuthContext';

export default function AuthorProfileView() {
  const { currentUser, updateCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
    handle: '',
    website: 'https://kalkiofficial.in',
    twitter: '@kalki_official',
    instagram: '@kalki_literary',
  });

  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || 'Kalki Krishnamurthy',
        email: currentUser.email || 'kalki@bookverse.in',
        bio: currentUser.bio || 'Master storyteller of Tamil historical realism and author of seminal works.',
        avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        handle: currentUser.handle || '@kalkistudio'
      }));
    }
  }, [currentUser]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiFetch('/studio/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          avatarUrl: formData.avatarUrl,
          handle: formData.handle || `@${formData.name.toLowerCase().replace(/\s+/g, '')}`
        })
      });

      if (res.success) {
        updateCurrentUser({
          name: formData.name,
          bio: formData.bio,
          avatarUrl: formData.avatarUrl,
          handle: formData.handle
        });
        showToast('success', 'Author profile updated successfully');
      }
    } catch (err) {
      showToast('error', `Failed to save author profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-[#F5F5DA] shadow-2xl border flex items-center gap-3 text-xs font-mono backdrop-blur-md ${
              toastMessage.type === 'success' ? 'bg-[#7B021D]/95 border-[#E9E5C8]/30' : 'bg-rose-950/95 border-rose-600'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HEADER ── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Feather className="w-3.5 h-3.5 text-[#7B021D]" />
            Studio Author Imprint Credentials
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#2B2B2B]">
            Author Profile
          </h1>
          <p className="text-xs text-[#6B5E5E] font-sans mt-0.5">
            Configure your public writer biography, pen name, and imprint settings
          </p>
        </div>
      </motion.div>

      {/* ── 2. MAIN DOCUMENT-STYLE PROFILE FORM ── */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSave}
        className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] shadow-md space-y-8 relative overflow-hidden"
      >
        {/* Ambient Subtle Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#7B021D]/5 blur-3xl rounded-full pointer-events-none" />

        {/* Avatar Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#E7D9D3] pb-8 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative p-1 rounded-full bg-gradient-to-tr from-[#7B021D] to-[#D3968C] shadow-lg shrink-0"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFFDF3] bg-[#F4EEEA] group">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#7B021D]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                {formData.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#7B021D]/10 border border-[#7B021D]/30 text-[10px] font-mono text-[#7B021D] font-bold">
                <ShieldCheck className="w-3 h-3 text-[#7B021D]" />
                Verified Studio Author
              </span>
            </div>
            <p className="text-xs text-[#6B5E5E] font-mono">
              {formData.handle || '@author'} · {formData.email}
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
                Display Name / Pen Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B5E5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] transition-colors shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] block font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B5E5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7D9D3] bg-[#F4EEEA] text-xs font-mono text-[#6B5E5E] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] transition-colors shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
              Author Biography
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-4 rounded-2xl border border-[#E7D9D3] bg-[#FFFDF3] text-xs font-mono text-[#2B2B2B] focus:outline-none focus:border-[#7B021D] transition-colors resize-none leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Save Action Button */}
        <div className="flex justify-end pt-4 border-t border-[#E7D9D3] relative z-10">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-7 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#F5F5DA]" />
            <span>{isLoading ? 'Saving Changes…' : 'Save Profile Changes'}</span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
