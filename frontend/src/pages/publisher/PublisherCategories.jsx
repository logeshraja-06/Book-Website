import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

export default function PublisherCategories() {
  const { categories: initialCategories } = useData();
  const [categories, setCategories] = useState(initialCategories);
  const [newCatName, setNewCatName] = useState('');

  const addCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = {
      id: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      count: 0,
      description: "Newly configured literary taxonomy category."
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const removeCat = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#E7D9D3] pb-4">
        <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
          Genre & Taxonomy Management
        </h2>
        <p className="text-xs text-[#6E6A67]">Configure platform category tags and literary classification</p>
      </div>

      {/* Inline Add Form */}
      <form onSubmit={addCategory} className="flex items-center gap-3 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3]">
        <input
          type="text"
          placeholder="New category or genre name…"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-transparent border-b border-[#E7D9D3] py-2 text-sm text-[#2B2B2B] focus:border-[#D3968C] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Category List */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7D9D3] divide-y divide-[#E7D9D3] shadow-sm">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-[#F4EEEA]/50 transition-colors">
            <div>
              <h4 className="font-editorial-serif text-base font-bold text-[#2B2B2B]">{cat.name}</h4>
              <p className="text-xs text-[#6E6A67]">{cat.description || cat.desc}</p>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs font-mono text-[#6E6A67]">{cat.count || 4} Titles</span>
              <button
                type="button"
                onClick={() => removeCat(cat.id)}
                className="p-2 rounded-full text-[#6E6A67] hover:text-[#C98579] transition-colors"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
