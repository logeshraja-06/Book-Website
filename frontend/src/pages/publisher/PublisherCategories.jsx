import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function PublisherCategories() {
  const { categories, fetchPublicData } = useData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
        showToast('✓ Category created successfully');
        setNewCatName('');
        setNewCatDesc('');
        if (fetchPublicData) fetchPublicData();
      }
    } catch (err) {
      showToast(`✗ Failed to create category: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCat = async (id) => {
    try {
      await apiFetch(`/editorial/categories/${id}`, {
        method: 'DELETE'
      });
      showToast('✓ Category deleted successfully');
      if (fetchPublicData) fetchPublicData();
    } catch (err) {
      showToast(`✗ Failed to delete category: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#2B2B2B] text-[#FAF8F6] shadow-xl border border-[#E7D9D3]/20 flex items-center gap-3 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#D3968C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E7D9D3] pb-4">
        <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
          Genre & Taxonomy Management
        </h2>
        <p className="text-xs text-[#6E6A67]">Configure platform category tags and literary classification</p>
      </div>

      {/* Inline Add Form */}
      <form onSubmit={addCategory} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3]">
        <input
          type="text"
          placeholder="Category name (e.g. Science Fiction)…"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-transparent border-b border-[#E7D9D3] py-2 text-sm text-[#2B2B2B] focus:border-[#D3968C] focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Brief description (optional)…"
          value={newCatDesc}
          onChange={(e) => setNewCatDesc(e.target.value)}
          className="flex-1 bg-transparent border-b border-[#E7D9D3] py-2 text-sm text-[#2B2B2B] focus:border-[#D3968C] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isLoading ? 'Adding…' : 'Add Category'}</span>
        </button>
      </form>

      {/* Category List */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] divide-y divide-[#E7D9D3] shadow-sm">
        {categories.map((cat) => {
          const catId = cat._id || cat.id;
          return (
            <div key={catId} className="p-4 flex items-center justify-between hover:bg-[#F4EEEA]/50 transition-colors">
              <div>
                <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">{cat.name}</h4>
                <p className="text-xs text-[#6E6A67]">{cat.desc || cat.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-[#6E6A67]">{cat.count || 0} Titles</span>
                <button
                  type="button"
                  onClick={() => removeCat(catId)}
                  className="p-2 rounded-full text-[#6E6A67] hover:text-[#C98579] transition-colors"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
