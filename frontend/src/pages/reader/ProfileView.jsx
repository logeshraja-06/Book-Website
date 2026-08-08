import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import { Edit2, CheckCircle2, User, X, Sparkles, BookOpen, Flame, Calendar, Award } from 'lucide-react';
import { useAuth, apiFetch } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

function StatCounter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionVal = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (decimals > 0) {
            setDisplayValue(latest.toFixed(decimals));
          } else {
            setDisplayValue(Math.floor(latest).toLocaleString('en-IN'));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, decimals, motionVal]);

  return (
    <span ref={ref} className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#211D1D] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function ProfileView() {
  const { currentUser, updateCurrentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Ananya Sharma',
    bio: currentUser?.bio || 'Avid collector of historical realism and modern Indian philosophy.',
    handle: currentUser?.handle || '@ananyareads',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEditOpen = () => {
    setFormData({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      handle: currentUser?.handle || `@${currentUser?.name?.toLowerCase().replace(/\s+/g, '') || 'reader'}`,
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiFetch('/reader/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (res.success) {
        updateCurrentUser({
          name: formData.name,
          bio: formData.bio,
          handle: formData.handle,
          avatarUrl: formData.avatarUrl
        });
        showToast('success', 'Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      showToast('error', `Failed to update profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const avatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const name = currentUser?.name || 'BookVerse Reader';
  const handle = currentUser?.handle || `@${name.toLowerCase().replace(/\s+/g, '')}`;
  const bio = currentUser?.bio || 'Avid reader and literature collector on BookVerse Studio.';

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
      className="space-y-10 max-w-4xl mx-auto relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-[#F5F5DA] shadow-2xl border flex items-center gap-3 text-xs font-mono backdrop-blur-md ${
              toastMessage.type === 'success' ? 'bg-[#7B021D]/95 border-[#E9E5C8]/30' : 'bg-rose-950/95 border-rose-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HEADER SECTION ── */}
      <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#7B021D]" />
            Personal Reading Passport
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            Reading Identity & Profile
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            Manage your personal reader credentials, preferred genres, and library statistics
          </p>
        </div>
      </motion.div>

      {/* ── 2. HERO IDENTITY CARD ── */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] rounded-3xl p-8 lg:p-10 border border-[#E7D9D3] shadow-md space-y-10 relative overflow-hidden"
      >
        {/* Ambient Subtle Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D3968C]/10 blur-3xl rounded-full pointer-events-none" />

        {/* Avatar & Bio Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b border-[#E7D9D3] pb-8 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative p-1 rounded-full bg-gradient-to-tr from-[#7B021D] to-[#D3968C] shadow-lg shrink-0"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFFDF3] bg-[#F4EEEA]">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#7B021D]" />
                </div>
              )}
            </div>
          </motion.div>

          <div className="space-y-2 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
                  {name}
                </h3>
                <span className="text-xs font-mono text-[#7B021D] font-bold block mt-0.5">
                  {handle}
                </span>
              </div>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEditOpen}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFDF3] border border-[#E7D9D3] text-xs font-mono font-bold uppercase tracking-wider text-[#2B2B2B] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#7B021D]" />
                <span>Edit Profile</span>
              </motion.button>
            </div>

            <p className="text-sm text-[#6B5E5E] leading-relaxed max-w-xl font-sans pt-1">
              "{bio}"
            </p>
          </div>
        </div>

        {/* ── 3. COUNT-UP METRICS ── */}
        <div className="space-y-4 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#7B021D] font-bold block flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#7B021D]" />
            Reader Metrics
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E7D9D3] bg-[#FFFDF3]/60 rounded-2xl px-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block">
                Books Read
              </span>
              <StatCounter target={14} />
              <span className="text-[11px] text-[#6B5E5E] font-sans block">Completed volumes</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block">
                Pages Completed
              </span>
              <StatCounter target={4280} />
              <span className="text-[11px] text-[#6B5E5E] font-sans block">Cumulative pages</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#7B021D]" /> Active Streak
              </span>
              <StatCounter target={18} suffix=" Days" />
              <span className="text-[11px] text-[#6B5E5E] font-sans block">Consecutive reading</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#7B021D]" /> Member Since
              </span>
              <StatCounter target={2026} />
              <span className="text-[11px] text-[#6B5E5E] font-sans block">Verified passport</span>
            </div>
          </div>
        </div>

        {/* ── 4. PREFERRED GENRES PILLS ── */}
        <div className="space-y-4 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#7B021D] font-bold block flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#7B021D]" />
            Preferred Genres & Taxonomy
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {['Historical Realism', 'Behavioral Economics', 'Ancient Philosophy', 'Biographies'].map((genre, idx) => (
              <motion.span
                key={genre}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                whileHover={{ y: -2, scale: 1.03 }}
                className="px-4 py-2 rounded-full bg-[#FFFDF3] border border-[#E7D9D3] text-xs font-mono text-[#2B2B2B] shadow-2xs font-semibold cursor-default"
              >
                {genre}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 5. EDIT PROFILE MODAL ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-4">
                <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                  Edit Reader Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full text-[#6B5E5E] hover:text-[#2B2B2B] hover:bg-[#F4EEEA] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Handle"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />

                <Input
                  label="Avatar Image URL"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                />

                <Input
                  label="Bio"
                  type="textarea"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7D9D3]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#6B5E5E] hover:text-[#2B2B2B] transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="submit" size="md" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
