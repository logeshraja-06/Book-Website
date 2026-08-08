import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, CheckCircle2, User, X } from 'lucide-react';
import { useAuth, apiFetch } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ProfileView() {
  const { currentUser, updateCurrentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Ananya Sharma',
    bio: currentUser?.bio || 'Avid collector of historical realism and modern Indian philosophy.',
    handle: currentUser?.handle || '@ananyareads',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
        showToast('✓ Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      showToast(`✗ Failed to update profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const avatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const name = currentUser?.name || 'BookVerse Reader';
  const handle = currentUser?.handle || `@${name.toLowerCase().replace(/\s+/g, '')}`;
  const bio = currentUser?.bio || 'Avid reader and literature collector on BookVerse Studio.';

  return (
    <div className="space-y-12 max-w-4xl relative">
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#7B021D] text-[#F5F5DA] shadow-xl border border-[#E9E5C8]/20 flex items-center gap-3 text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 text-[#F5F5DA]" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E9E5C8] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal">
            Reading Identity & Profile
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1">
            Your personal reader passport and preference settings
          </p>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="bg-[#FFFDF3] rounded-3xl p-8 lg:p-10 border border-[#E9E5C8] shadow-2xs space-y-10">
        {/* Avatar & Bio Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b border-[#E9E5C8] pb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E9E5C8] shrink-0 bg-[#F5F5DA]">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#7B021D]" />
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial-serif text-3xl font-bold text-[#211D1D]">
                  {name}
                </h3>
                <span className="text-xs font-mono text-[#7B021D] font-bold block">
                  {handle}
                </span>
              </div>
              <button
                type="button"
                onClick={handleEditOpen}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-bold uppercase tracking-wider text-[#211D1D] hover:border-[#7B021D] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p className="text-sm text-[#6B5E5E] leading-relaxed max-w-xl">
              "{bio}"
            </p>
          </div>
        </div>

        {/* Reader Metrics */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
            Reader Metrics
          </span>
          <div className="py-4 border-y border-[#E9E5C8] flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-mono text-[#6B5E5E]">
            <div>
              <strong className="font-editorial-serif text-2xl text-[#211D1D] block">14</strong>
              <span>Books Read</span>
            </div>
            <span className="text-[#E9E5C8] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#211D1D] block">4,280</strong>
              <span>Pages Completed</span>
            </div>
            <span className="text-[#E9E5C8] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#211D1D] block">18 Days</strong>
              <span>Active Streak</span>
            </div>
            <span className="text-[#E9E5C8] hidden sm:inline">·</span>
            <div>
              <strong className="font-editorial-serif text-2xl text-[#211D1D] block">2026</strong>
              <span>Member Since</span>
            </div>
          </div>
        </div>

        {/* Preferred Genres */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
            Preferred Genres
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {['Historical Realism', 'Behavioral Economics', 'Ancient Philosophy', 'Biographies'].map((genre) => (
              <span
                key={genre}
                className="px-3.5 py-1.5 rounded-full bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-mono text-[#211D1D]"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-4">
              <h3 className="font-editorial-serif text-2xl font-bold text-[#211D1D]">
                Edit Reader Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-[#6B5E5E] hover:text-[#211D1D]"
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9E5C8]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#6B5E5E] hover:text-[#211D1D]"
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
    </div>
  );
}
