import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import { Plus, Trash2, CheckCircle2, Tag, AlertCircle } from 'lucide-react';

export default function PublisherCategories() {
  const { categories = [], fetchPublicData } = useData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsLoading(true);

    try {
      const res = await apiFetch('/editorial/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCatName.trim(),
          desc: newCatDesc.trim() || 'Newly configured literary taxonomy category.'
        })
      });

      if (res.success) {
        showToast('success', 'Category created successfully');
        setNewCatName('');
        setNewCatDesc('');
        if (fetchPublicData) fetchPublicData();
      }
    } catch (err) {
      showToast('error', `Failed to create category: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCat = async (id) => {
    try {
      await apiFetch(`/editorial/categories/${id}`, {
        method: 'DELETE'
      });
      showToast('success', 'Category deleted successfully');
      if (fetchPublicData) fetchPublicData();
    } catch (err) {
      showToast('error', `Failed to delete category: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* ── 1. ANIMATED TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-[#F5F5DA] shadow-2xl border flex items-center gap-3 text-xs font-mono backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-[#211D1D]/95 border-[#7B021D]'
                : 'bg-rose-950/95 border-rose-600'
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

      {/* ── 2. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Tag className="w-3.5 h-3.5 text-[#7B021D]" />
            Taxonomy Console
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-bold">
            Genre & Taxonomy Management
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            Configure platform category tags, descriptions, and literary classification
          </p>
        </div>
      </div>

      {/* ── 3. INLINE ADD FORM ── */}
      <form
        onSubmit={addCategory}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl border border-[#E9E5C8] shadow-md"
      >
        <input
          type="text"
          placeholder="Category name (e.g. Behavioral Economics)…"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-[#FFFDF3] rounded-2xl border border-[#E9E5C8] px-4 py-2.5 text-xs text-[#211D1D] focus:border-[#7B021D] focus:outline-none transition-colors font-mono"
          required
        />
        <input
          type="text"
          placeholder="Brief description (optional)…"
          value={newCatDesc}
          onChange={(e) => setNewCatDesc(e.target.value)}
          className="flex-1 bg-[#FFFDF3] rounded-2xl border border-[#E9E5C8] px-4 py-2.5 text-xs text-[#211D1D] focus:border-[#7B021D] focus:outline-none transition-colors font-mono"
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shrink-0 shadow-md disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{isLoading ? 'Creating…' : 'Add Category'}</span>
        </motion.button>
      </form>

      {/* ── 4. CATEGORY REGISTRY LIST ── */}
      <div className="bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl border border-[#E9E5C8] divide-y divide-[#E9E5C8] shadow-md overflow-hidden">
        {categories.map((cat, idx) => {
          const catId = cat._id || cat.id;
          return (
            <motion.div
              key={catId || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="p-5 flex items-center justify-between hover:bg-[#FFFDF3] transition-colors group"
            >
              <div>
                <h4 className="font-editorial-serif text-base font-bold text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-[#6B5E5E] font-sans mt-0.5">{cat.desc || cat.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-[#6B5E5E]">
                  {cat.count || 0} Titles
                </span>
                <button
                  type="button"
                  onClick={() => removeCat(catId)}
                  className="p-2 rounded-full text-[#6B5E5E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
