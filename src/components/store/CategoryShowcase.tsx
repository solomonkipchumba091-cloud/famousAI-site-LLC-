import React from 'react';
import { Rocket, Sparkles, Palette, Code2, ArrowRight } from 'lucide-react';
import type { ProductCategory } from '@/types';
import { CATEGORY_INFO } from '@/types';
import { useFilterStore } from '@/lib/store';

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  saas_starter: <Rocket className="w-8 h-8" />,
  prompt: <Sparkles className="w-8 h-8" />,
  ui_kit: <Palette className="w-8 h-8" />,
  cursor_rule: <Code2 className="w-8 h-8" />
};

export const CategoryShowcase: React.FC = () => {
  const setFilters = useFilterStore((state) => state.setFilters);

  const handleCategoryClick = (category: ProductCategory) => {
    setFilters({ category });
    const storeSection = document.getElementById('store-section');
    storeSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Explore by Category
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            From production-ready SaaS starters to AI prompts and UI kits, 
            find the perfect tools for your next project.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(CATEGORY_INFO) as ProductCategory[]).map((category) => {
            const info = CATEGORY_INFO[category];
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-left hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {categoryIcons[category]}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {info.label}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {info.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Browse
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
