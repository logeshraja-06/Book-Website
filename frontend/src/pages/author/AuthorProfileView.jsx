import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import {
  User,
  Camera,
  Save,
  CheckCircle2,
  ShieldCheck,
  Feather,
  AlertCircle,
  BookOpen,
  Users,
  Star,
  FileText,
  Sliders,
  Key
} from 'lucide-react';
import { useAuth, apiFetch } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { handleImgError, DEFAULT_AVATAR, DEFAULT_BOOK_COVER } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

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

export default function AuthorProfileView() {
  const { t } = useTranslation();
  const { currentUser, updateCurrentUser } = useAuth();
  const { books = [], studioBooks = [] } = useData();

  const [activeTab, setActiveTab] = useState('imprint'); // 'imprint' | 'catalogue' | 'preferences' | 'security'
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [isLoading, setIsLoading] = useState(false);

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

  const [preferences, setPreferences] = useState({
    genreCategory: 'Historical Realism & Epic Fiction',
    royaltiesPayout: 'Direct Bank Transfer (Monthly)',
    copyrightHolder: 'Kalki Krishnamurthy Imprint Estate',
    submissionAutoNotify: true
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

  const handleSaveProfile = async (e) => {
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
        showToast('success', t('author.profile.toastImprintUpdated'));
      }
    } catch (err) {
      showToast('error', `${t('author.profile.toastImprintFailed')} ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast('error', t('author.profile.toastPasswordMismatch'));
      return;
    }
    showToast('success', t('author.profile.toastSecurityUpdated'));
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Filter books published by this author
  const authorWorks = (studioBooks.length > 0 ? studioBooks : books).filter(
    (b) => b.authorId === 'kalki-krishnamurthy' || b.author === currentUser?.name || b.author === 'Kalki Krishnamurthy'
  );

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
    { id: 'imprint', label: t('author.profile.tabImprint'), icon: Feather },
    { id: 'catalogue', label: t('author.profile.tabCatalogue'), icon: BookOpen },
    { id: 'preferences', label: t('author.profile.tabPreferences'), icon: Sliders },
    { id: 'security', label: t('author.profile.tabSecurity'), icon: Key }
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
            <Feather className="w-3.5 h-3.5 text-[#212842]" />
            {t('author.profile.consoleEyebrow')}
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#181616]">
            {t('author.profile.title')}
          </h1>
          <p className="text-xs text-[#5F594F] font-sans mt-0.5">
            {t('author.profile.subtitle')}
          </p>
        </div>

        {/* Tab Selector */}
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
                    layoutId="authorProfileTabPill"
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

      {/* ── 2. IMPRINT TAB ── */}
      {activeTab === 'imprint' && (
        <motion.div variants={itemVariants} className="space-y-8">
          {/* HEADER IDENTITY CARD */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#212842]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#DED7BD] pb-8 relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative p-1 rounded-full bg-gradient-to-tr from-[#212842] to-[#D8CFAE] shadow-lg shrink-0"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFFDF3] bg-[#F8F6E5] group">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl || DEFAULT_AVATAR}
                      alt={formData.name}
                      onError={(e) => handleImgError(e, DEFAULT_AVATAR)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-[#212842]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                    {formData.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-[10px] font-mono text-[#212842] font-bold">
                    <ShieldCheck className="w-3 h-3 text-[#212842]" />
                    {t('author.profile.verifiedAuthor')}
                  </span>
                </div>
                <p className="text-xs text-[#5F594F] font-mono">
                  {formData.handle || '@author'} · {formData.email}
                </p>
                <p className="text-xs text-[#5F594F] font-sans italic max-w-xl">
                  "{formData.bio}"
                </p>
              </div>
            </div>

            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#DED7BD] bg-[#F8F6E5] rounded-2xl px-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#212842]" /> {t('author.profile.statWorks')}
                </span>
                <StatCounter target={authorWorks.length || 5} />
                <span className="text-[11px] text-[#5F594F] font-sans block">{t('author.profile.statWorksSub')}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#212842]" /> {t('author.profile.statReaders')}
                </span>
                <StatCounter target={28400} />
                <span className="text-[11px] text-[#5F594F] font-sans block">{t('author.profile.statReadersSub')}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#212842]" /> {t('author.profile.statRating')}
                </span>
                <StatCounter target={4.9} decimals={1} suffix=" ★" />
                <span className="text-[11px] text-[#5F594F] font-sans block">{t('author.profile.statRatingSub')}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#827A6D] font-bold block flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#212842]" /> {t('author.profile.statManuscripts')}
                </span>
                <StatCounter target={8} />
                <span className="text-[11px] text-[#5F594F] font-sans block">{t('author.profile.statManuscriptsSub')}</span>
              </div>
            </div>

            {/* EDIT FORM */}
            <form onSubmit={handleSaveProfile} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label={t('author.profile.displayPenName')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label={t('author.profile.authorHandle')}
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />
              </div>

              <Input
                label={t('author.profile.avatarUrl')}
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              />

              <Input
                label={t('author.profile.publicBio')}
                type="textarea"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />

              <div className="flex justify-end pt-4 border-t border-[#DED7BD]">
                <Button type="submit" size="md" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  <span>{isLoading ? t('author.profile.savingImprint') : t('author.profile.saveImprintChanges')}</span>
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* ── 3. CATALOGUE TAB ── */}
      {activeTab === 'catalogue' && (
        <motion.div variants={itemVariants} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-6">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              {t('author.profile.catalogueTitle')}
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              {t('author.profile.catalogueSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {authorWorks.map((b) => (
              <div key={b.id || b._id} className="p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] space-y-3 flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-22 rounded-lg overflow-hidden bg-[#D8CFAE] shrink-0">
                    <img
                      src={b.coverImage || b.coverUrl || DEFAULT_BOOK_COVER}
                      alt={b.title}
                      onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#212842] font-bold block">{b.genre}</span>
                    <h4 className="font-editorial-serif text-lg font-bold text-[#181616] leading-tight mt-0.5">{b.title}</h4>
                    <span className="text-xs font-mono text-[#5F594F] block mt-1">₹{b.price} · {b.rating}★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── 4. PREFERENCES TAB ── */}
      {activeTab === 'preferences' && (
        <motion.div variants={itemVariants} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              {t('author.profile.preferencesTitle')}
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              {t('author.profile.preferencesSubtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                {t('author.profile.primaryGenre')}
              </label>
              <select
                value={preferences.genreCategory}
                onChange={(e) => setPreferences({ ...preferences, genreCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono text-[#181616] focus:outline-none focus:border-[#212842]"
              >
                <option>Historical Realism & Epic Fiction</option>
                <option>Literary Fiction & Drama</option>
                <option>Philosophy & Essays</option>
                <option>Biographies & Memoirs</option>
              </select>
            </div>

            <Input
              label={t('author.profile.royaltiesPayout')}
              value={preferences.royaltiesPayout}
              onChange={(e) => setPreferences({ ...preferences, royaltiesPayout: e.target.value })}
            />

            <Input
              label={t('author.profile.copyrightHolder')}
              value={preferences.copyrightHolder}
              onChange={(e) => setPreferences({ ...preferences, copyrightHolder: e.target.value })}
            />
          </div>

          <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
            <Button size="md" onClick={() => showToast('success', 'Author publishing preferences saved')}>
              {t('author.profile.savePublishingPreferences')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── 5. SECURITY TAB ── */}
      {activeTab === 'security' && (
        <motion.form variants={itemVariants} onSubmit={handleSecuritySave} className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] shadow-md space-y-8">
          <div>
            <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
              {t('author.profile.securityTitle')}
            </h3>
            <p className="text-xs text-[#5F594F] font-sans mt-1">
              {t('author.profile.securitySubtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label={t('author.profile.registeredEmail')}
              value={formData.email}
              disabled
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={t('author.profile.newPassword')}
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
              />
              <Input
                label={t('author.profile.confirmNewPassword')}
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#DED7BD] flex justify-end">
            <Button type="submit" size="md">
              {t('author.profile.saveSecurityChanges')}
            </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}
