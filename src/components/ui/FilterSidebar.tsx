import React from 'react';
import { X, Filter, Rocket, Sparkles, Palette, Code2 } from 'lucide-react';
import type { ProductCategory } from '@/types';
import { CATEGORY_INFO } from '@/types';
import { useFilterStore } from '@/lib/store';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
}

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  saas_starter: <Rocket className="w-4 h-4" />,
  prompt: <Sparkles className="w-4 h-4" />,
  ui_kit: <Palette className="w-4 h-4" />,
  cursor_rule: <Code2 className="w-4 h-4" />
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, allTags }) => {
  const { filters, setFilters, resetFilters } = useFilterStore();

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 2500 },
    { label: '$25 - $50', min: 2500, max: 5000 },
    { label: '$50 - $100', min: 5000, max: 10000 },
    { label: '$100 - $200', min: 10000, max: 20000 },
    { label: 'Over $200', min: 20000, max: undefined }
  ];

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setFilters({ category });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilters({ minPrice: min, maxPrice: max });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setFilters({ tags: newTags });
  };

  const handleSortChange = (sortBy: typeof filters.sortBy) => {
    setFilters({ sortBy });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-72 bg-zinc-900 border-r border-zinc-800 z-50 lg:z-auto transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Filter className="w-5 h-5 text-purple-500" />
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-zinc-800 rounded"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.category === 'all'
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-current" />
                </span>
                All Products
              </button>
              {(Object.keys(CATEGORY_INFO) as ProductCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.category === category
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {categoryIcons[category]}
                  {CATEGORY_INFO[category].label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Price Range</h3>
            <div className="space-y-1">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Sort By</h3>
            <select
              value={filters.sortBy || 'popular'}
              onChange={(e) => handleSortChange(e.target.value as typeof filters.sortBy)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    filters.tags?.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
