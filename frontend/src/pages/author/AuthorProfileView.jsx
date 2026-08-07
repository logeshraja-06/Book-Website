import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Globe, Share2, Camera, Save, CheckCircle2 } from 'lucide-react';
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

  const [toastMessage, setToastMessage] = useState(null);
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
        showToast('✓ Author profile updated successfully');
      }
    } catch (err) {
      showToast(`✗ Failed to save author profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D3968C] font-semibold">
            Public Author Bio & Settings
          </span>
          <h1 className="font-editorial-serif text-3xl font-normal text-[#2B2B2B]">
            Author Profile
          </h1>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F6] border border-[#E7D9D3] shadow-lg space-y-8">
        {/* Avatar Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7D9D3] shadow-md group bg-[#F4EEEA]">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#D3968C]" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-editorial-serif text-xl font-bold">{formData.name}</h3>
            <p className="text-xs text-[#6E6A67]">Verified Studio Author · {formData.email}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] font-semibold block">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6E6A67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7D9D3] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#D3968C]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] font-semibold block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6E6A67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7D9D3] bg-[#F4EEEA] text-xs font-mono text-[#6E6A67] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] font-semibold block">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7D9D3] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#D3968C]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6E6A67] font-semibold block">
              Author Biography
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-4 rounded-xl border border-[#E7D9D3] bg-[#FFFFFF] text-xs font-mono focus:outline-none focus:border-[#D3968C] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-[#E7D9D3]">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#D3968C]" />
            <span>{isLoading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#2B2B2B] text-[#FAF8F6] text-xs font-mono shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D3968C]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
