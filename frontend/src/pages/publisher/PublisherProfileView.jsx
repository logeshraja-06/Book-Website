import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  Building2,
  Key,
  Sliders,
  AlertCircle,
  BookOpen,
  Users,
  CheckSquare,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

export default function PublisherProfileView() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { books = [], editorialQueue = [] } = useData();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'imprint' | 'queue' | 'security'
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    imprintName: 'BookVerse Editorial House',
    bio: '',
    avatarUrl: '',
    reviewThreshold: '4.0',
    autoAssign: true
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || 'Editorial Control Desk',
        email: currentUser.email || 'editor@bookverse.studio',
        bio: currentUser.bio || 'Managing Publisher & Editorial Chief overseeing catalog evaluation and author rights.',
        avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
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
      updateCurrentUser({
        name: formData.name,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl
      });
      showToast('success', 'Publisher control desk credentials updated successfully');
    } catch (err) {
      showToast('error', `Failed to update credentials: ${err.message}`);
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
    showToast('success', 'Publisher security credentials updated successfully');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  const tabs = [
    { id: 'profile', label: 'Publisher Profile', icon: ShieldCheck },
    { id: 'imprint', label: 'House Imprint & Identity', icon: Building2 },
    { id: 'queue', label: 'Review Queue Preferences', icon: Sliders },
    { id: 'security', label: 'Security Credentials', icon: Key }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 relative bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-[#F5F5DA] shadow-2xl border flex items-center gap-3 text-xs font-mono backdrop-blur-md ${
              toastMessage.type === 'success' ? 'bg-[#212842]/95 border-[#D8CFAE]/30' : 'bg-rose-950/95 border-rose-600'
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8CFAE] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#212842]" />
            Editorial Authority & Administrative Clearance
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#181616]">
            Publisher Settings & Profile
          </h1>
          <p className="text-xs text-[#5F594F] font-sans mt-0.5">
            Configure house imprint credentials, manuscript review queue parameters, and administrative access
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
                    layoutId="publisherProfileTabPill"
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

      {/* ── 2. TAB CONTENT PANELS WITH ANIMATEPRESENCE ENTRANCE ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#212842]/5 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#DED7BD] pb-8 relative z-10">
                <motion.div
                  whileHover={{ scale: 1.04, boxShadow: '0 0 0 4px rgba(33,40,66,0.12)' }}
                  transition={{ duration: 0.2 }}
                  className="relative p-1 rounded-full bg-gradient-to-tr from-[#212842] to-[#D8CFAE] shadow-lg shrink-0 cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFFDF3] bg-[#F8F6E5]">
                    <img
                      src={formData.avatarUrl || DEFAULT_AVATAR}
                      alt={formData.name}
                      onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                      {formData.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-[10px] font-mono text-[#212842] font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#212842]" />
                      Verified Publisher Registrar
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#5F594F]">{formData.email}</p>
                  <p className="text-xs text-[#5F594F] font-sans italic max-w-xl">
                    "{formData.bio}"
                  </p>
                </div>
              </div>

              {/* OVERVIEW STATS WITH TACTILE LIFT */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#DED7BD] bg-[#F8F6E5] rounded-2xl px-6">
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#212842]" /> Catalog
                  </span>
                  <StatCounter target={books.length || 12} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Published titles</span>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-[#212842]" /> Queue
                  </span>
                  <StatCounter target={editorialQueue.length || 4} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Under evaluation</span>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#212842]" /> Imprint Authors
                  </span>
                  <StatCounter target={85} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Verified writers</span>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-[#212842]" /> Approved
                  </span>
                  <StatCounter target={142} />
                  <span className="text-[11px] text-[#5F594F] font-sans block">Approved editions</span>
                </motion.div>
              </div>

              {/* PROFILE FORM */}
              <form onSubmit={handleSave} className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Publisher Title / Chief Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Avatar Image URL"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  />
                </div>

                <Input
                  label="Editorial Directive & House Bio"
                  type="textarea"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />

                <div className="flex justify-end pt-4 border-t border-[#DED7BD]">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" size="md" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      <span>{isLoading ? 'Saving Credentials...' : 'Save Publisher Credentials'}</span>
                    </Button>
                  </motion.div>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── 3. HOUSE IMPRINT TAB ── */}
        {activeTab === 'imprint' && (
          <motion.div
            key="imprint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8"
          >
            <div>
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                House Imprint & Identity
              </h3>
              <p className="text-xs text-[#5F594F] font-sans mt-1">
                Manage house publication title, imprint branding, and editorial contact info
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="House Imprint Name"
                value={formData.imprintName}
                onChange={(e) => setFormData({ ...formData, imprintName: e.target.value })}
              />

              <Input
                label="Administrative Contact Email"
                value={formData.email}
                disabled
              />

              <div className="p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] space-y-1">
                <span className="text-xs font-mono font-bold text-[#181616] block">Editorial Clearance Level</span>
                <span className="text-[11px] text-[#5F594F] font-sans block">Master Rights & Catalog Distribution Authority</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="md" onClick={() => showToast('success', 'House imprint identity updated')}>
                  Save House Imprint
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── 4. REVIEW QUEUE PREFERENCES TAB ── */}
        {activeTab === 'queue' && (
          <motion.div
            key="queue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8"
          >
            <div>
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                Review Queue Preferences
              </h3>
              <p className="text-xs text-[#5F594F] font-sans mt-1">
                Set evaluation criteria for manuscript approval and automated review assignments
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                  Manuscript Evaluation Rating Threshold
                </label>
                <select
                  value={formData.reviewThreshold}
                  onChange={(e) => setFormData({ ...formData, reviewThreshold: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842]"
                >
                  <option value="3.5">Rating ≥ 3.5 Stars (Permissive)</option>
                  <option value="4.0">Rating ≥ 4.0 Stars (Standard Quality)</option>
                  <option value="4.5">Rating ≥ 4.5 Stars (Strict Excellence)</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] cursor-pointer">
                <div>
                  <span className="text-xs font-mono font-bold text-[#181616] block">Automated Editorial Assignment</span>
                  <span className="text-[11px] text-[#5F594F] font-sans block">Auto-route incoming submissions to category specialists</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoAssign}
                  onChange={(e) => setFormData({ ...formData, autoAssign: e.target.checked })}
                  className="w-4 h-4 accent-[#212842]"
                />
              </label>
            </div>

            <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="md" onClick={() => showToast('success', 'Review queue preferences updated')}>
                  Save Queue Preferences
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── 5. SECURITY TAB ── */}
        {activeTab === 'security' && (
          <motion.form
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSecuritySave}
            className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8"
          >
            <div>
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                Publisher Security Credentials
              </h3>
              <p className="text-xs text-[#5F594F] font-sans mt-1">
                Update password, manage administrative tokens, and review security clearance
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="Publisher Registrar Email"
                value={formData.email}
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button type="submit" size="md">
                  Update Publisher Security Credentials
                </Button>
              </motion.div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
