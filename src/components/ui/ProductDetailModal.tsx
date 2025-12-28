import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Star, 
  Download, 
  Check, 
  ExternalLink,
  Rocket,
  Sparkles,
  Palette,
  Code2
} from 'lucide-react';
import type { Product, ProductCategory } from '@/types';
import { useCartStore } from '@/lib/store';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  saas_starter: <Rocket className="w-5 h-5" />,
  prompt: <Sparkles className="w-5 h-5" />,
  ui_kit: <Palette className="w-5 h-5" />,
  cursor_rule: <Code2 className="w-5 h-5" />
};

const categoryLabels: Record<ProductCategory, string> = {
  saas_starter: 'SaaS Starter',
  prompt: 'AI Prompt',
  ui_kit: 'UI Kit',
  cursor_rule: 'Cursor Rule'
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen || !product) return null;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Image */}
            <div className="relative aspect-square lg:aspect-auto">
              <img
                src={product.image_url || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Right - Details */}
            <div className="p-6 lg:p-8">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm font-medium">
                  {categoryIcons[product.category]}
                  {categoryLabels[product.category]}
                </span>
                {product.is_featured && (
                  <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                {product.name}
              </h2>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {product.rating_average.toFixed(1)} ({product.rating_count} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {product.downloads_count} downloads
                </span>
              </div>

              {/* Description */}
              <p className="text-zinc-400 mb-6">
                {product.long_description || product.description}
              </p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {product.tech_stack && product.tech_stack.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-purple-600/10 text-purple-400 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Link */}
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mb-6"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Price & CTA */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800 bg-zinc-900/50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price_cents)}
              </span>
              {product.compare_price_cents && product.compare_price_cents > product.price_cents && (
                <span className="text-lg text-zinc-500 line-through">
                  {formatPrice(product.compare_price_cents)}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">One-time purchase</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/25"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
