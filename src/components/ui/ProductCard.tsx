import React from 'react';
import { Star, Download, ShoppingCart, Eye, Sparkles, Rocket, Palette, Code2 } from 'lucide-react';
import type { Product, ProductCategory } from '@/types';
import { useCartStore, useUIStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  saas_starter: <Rocket className="w-4 h-4" />,
  prompt: <Sparkles className="w-4 h-4" />,
  ui_kit: <Palette className="w-4 h-4" />,
  cursor_rule: <Code2 className="w-4 h-4" />
};

const categoryColors: Record<ProductCategory, string> = {
  saas_starter: 'from-purple-500 to-pink-500',
  prompt: 'from-cyan-500 to-blue-500',
  ui_kit: 'from-green-500 to-emerald-500',
  cursor_rule: 'from-orange-500 to-yellow-500'
};

const categoryLabels: Record<ProductCategory, string> = {
  saas_starter: 'SaaS Starter',
  prompt: 'AI Prompt',
  ui_kit: 'UI Kit',
  cursor_rule: 'Cursor Rule'
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openModal = useUIStore((state) => state.openModal);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.category === 'prompt' && product.preview_content) {
      openModal('prompt-runner', product);
    } else if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryColors[product.category]} text-white text-xs font-medium`}>
          {categoryIcons[product.category]}
          <span>{categoryLabels[product.category]}</span>
        </div>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-yellow-500/90 text-black text-xs font-bold">
            Featured
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePreview}
            className="p-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-white transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {product.rating_average.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {product.downloads_count}
            </span>
          </div>
          <div className="text-right">
            {product.compare_price_cents && product.compare_price_cents > product.price_cents && (
              <span className="text-xs text-zinc-500 line-through mr-2">
                {formatPrice(product.compare_price_cents)}
              </span>
            )}
            <span className="font-bold text-white">
              {formatPrice(product.price_cents)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
