import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import {
  Edit2,
  CheckCircle2,
  User,
  X,
  Sparkles,
  BookOpen,
  Flame,
  Award,
  ShieldCheck,
  Key,
  Sliders,
  Heart
} from 'lucide-react';
import { useAuth, apiFetch } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { handleImgError, DEFAULT_AVATAR } from '../../utils/imageFallback';

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
    <span ref={ref} className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#181616] block tracking-tight">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function ProfileView() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { wishlistBooks = [] } = useData();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'preferences' | 'security' | 'privacy'
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    handle: '',
    avatarUrl: ''
  });

  const [preferences, setPreferences] = useState({
    fontSize: 'Medium (16px)',
    fontFamily: 'Cormorant Garamond (Serif)',
    theme: 'Warm Ivory (Default)',
    emailNotifications: true,
    weeklyDigest: true,
    activityPublic: true
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || 'Logesh Raja',
        bio: currentUser.bio || 'Avid collector of Tamil historical realism, philosophy, and modern economics.',
        handle: currentUser.handle || `@${currentUser.name?.toLowerCase().replace(/\s+/g, '') || 'reader'}`,
        avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
    }
  }, [currentUser]);

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
        showToast('success', 'Reader profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      showToast('error', `Failed to update profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    showToast('success', 'Security credentials updated successfully');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  const tabs = [
    { id: 'overview', label: 'Reading Profile', icon: User },
    { id: 'preferences', label: 'Reading Preferences', icon: Sliders },
    { id: 'security', label: 'Account & Security', icon: Key },
    { id: 'privacy', label: 'Privacy & Digest', icon: ShieldCheck }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto relative bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-[#F5F5DA] shadow-2xl border flex items-center gap-3 text-xs font-mono backdrop-blur-md ${
              toastMessage.type === 'success' ? 'bg-[#212842]/95 border-[#D8CFAE]/40' : 'bg-rose-950/95 border-rose-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8CFAE] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#212842]" />
            Personal Literary Membership
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#181616] font-bold tracking-tight">
            Reader Profile & Settings
          </h2>
          <p className="text-xs text-[#5F594F] mt-1 font-sans">
            Manage your personal literary credentials, reading preferences, and account security
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F1EED2] border border-[#D8CFAE] rounded-2xl overflow-x-auto self-start sm:self-auto max-w-full">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#F5F5DA]' : 'text-[#5F594F] hover:text-[#181616] hover:bg-[#F8F6E5]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="readerProfileTabPill"
                    className="absolute inset-0 bg-[#212842] rounded-xl shadow-sm z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── 2. MAIN CONTENT PANELS ── */}
      {activeTab === 'overview' && (
        <motion.div variants={itemVariants} className="space-y-8">
          {/* HERO IDENTITY CARD */}
          <div className="bg-[#FFFDF3] rounded-3xl p-8 lg:p-10 border border-[#D8CFAE] shadow-md space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#212842]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b border-[#DED7BD] pb-8 relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative p-1 rounded-full bg-gradient-to-tr from-[#212842] to-[#D8CFAE] shadow-lg shrink-0"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFFDF3] bg-[#F8F6E5]">
                  {avatar ? (
                    <img
                      src={avatar || DEFAULT_AVATAR}
                      alt={name}
                      onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-[#212842]" />
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-editorial-serif text-3xl font-bold text-[#181616]">
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-[#212842] font-bold">
                        {handle}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-[10px] font-mono text-[#212842] font-bold">
                        Verified Reader Passport
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEditOpen}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-xs font-mono font-bold uppercase tracking-wider text-[#181616] hover:border-[#212842] hover:text-[#212842] transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#212842]" />
                    <span>Edit Profile</span>
                  </motion.button>
                </div>

                <p className="text-sm text-[#5F594F] leading-relaxed max-w-xl font-sans pt-1">
                  "{bio}"
                </p>
              </div>
            </div>

            {/* COUNT-UP METRICS */}
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#212842] font-bold block flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#212842]" />
                Reader Overview Statistics
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#DED7BD] bg-[#F8F6E5] rounded-2xl px-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block">
                    Books Read
                  </span>
                  <StatCounter target={14} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Completed volumes</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block">
                    Pages Completed
                  </span>
                  <StatCounter target={4280} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Cumulative pages</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[#212842]" /> Saved Books
                  </span>
                  <StatCounter target={wishlistBooks.length || 6} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Wishlist catalogue</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#212842]" /> Active Streak
                  </span>
                  <StatCounter target={18} suffix=" Days" />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Consecutive reading</span>
                </div>
              </div>
            </div>

            {/* PREFERRED GENRES PILLS */}
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#212842] font-bold block flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#212842]" />
                Preferred Literary Taxonomy
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {['Historical Realism', 'Behavioral Economics', 'Ancient Philosophy', 'Biographies', 'Literary Fiction'].map((genre, idx) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                    whileHover={{ y: -2, scale: 1.03 }}
                    className="px-4 py-2 rounded-full bg-[#F8F6E5] border border-[#D8CFAE] text-xs font-mono text-[#181616] shadow-2xs font-semibold cursor-default"
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'preferences' && (
        <motion.div variants={itemVariants} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              Reading & Display Preferences
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              Customize typography, background contrast, and digital reader viewing defaults
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  Reader Font Size
                </label>
                <select
                  value={preferences.fontSize}
                  onChange={(e) => setPreferences({ ...preferences, fontSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842]"
                >
                  <option>Small (14px)</option>
                  <option>Medium (16px)</option>
                  <option>Large (18px)</option>
                  <option>Extra Large (22px)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  Serif Typography Family
                </label>
                <select
                  value={preferences.fontFamily}
                  onChange={(e) => setPreferences({ ...preferences, fontFamily: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842]"
                >
                  <option>Cormorant Garamond (Serif)</option>
                  <option>EB Garamond (Editorial Classic)</option>
                  <option>Lora (Modern Serif)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                Default Canvas Surface Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842]"
              >
                <option>Warm Ivory (BookVerse Standard)</option>
                <option>Sepia Vintage Paper</option>
                <option>Midnight Velvet Dark</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
            <Button size="md" onClick={() => showToast('success', 'Reading preferences saved')}>
              Save Reading Preferences
            </Button>
          </div>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.form variants={itemVariants} onSubmit={handleSecuritySave} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              Account & Security Credentials
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              Update password, review verified email address, and manage security options
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Account Email Address"
              value={currentUser?.email || 'reader@bookverse.studio'}
              disabled
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="New Password"
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
            <Button type="submit" size="md">
              Update Security Credentials
            </Button>
          </div>
        </motion.form>
      )}

      {activeTab === 'privacy' && (
        <motion.div variants={itemVariants} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              Privacy & Notification Digest
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              Control public profile visibility and literary publication updates
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] cursor-pointer">
              <div>
                <span className="text-xs font-mono font-bold text-[#181616] block">Public Reading Passport</span>
                <span className="text-[11px] text-[#5F594F] font-sans block">Allow other BookVerse readers to view your preferred genres</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.activityPublic}
                onChange={(e) => setPreferences({ ...preferences, activityPublic: e.target.checked })}
                className="w-4 h-4 accent-[#212842]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] cursor-pointer">
              <div>
                <span className="text-xs font-mono font-bold text-[#181616] block">Weekly Literary Digest</span>
                <span className="text-[11px] text-[#5F594F] font-sans block">Receive curated author releases and new catalog arrivals</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(e) => setPreferences({ ...preferences, weeklyDigest: e.target.checked })}
                className="w-4 h-4 accent-[#212842]"
              />
            </label>
          </div>

          <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
            <Button size="md" onClick={() => showToast('success', 'Privacy preferences updated')}>
              Save Privacy Settings
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── 3. EDIT PROFILE MODAL ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#F5F5DA] rounded-3xl p-6 sm:p-8 border border-[#D8CFAE] shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#D8CFAE] pb-4">
                <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                  Edit Reader Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full text-[#5F594F] hover:text-[#181616] hover:bg-[#F1EED2] transition-colors"
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

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8CFAE]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#5F594F] hover:text-[#181616] transition-colors"
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
