import React, { useEffect, useState } from 'react';
import { Loader2, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('downloads_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Products</h2>
              <p className="text-zinc-400 text-sm">Hand-picked by our team</p>
            </div>
          </div>
          <button
            onClick={() => {
              const storeSection = document.getElementById('store-section');
              storeSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
