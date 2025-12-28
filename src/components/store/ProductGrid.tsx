import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Package, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';
import { useFilterStore } from '@/lib/store';

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { filters } = useFilterStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('downloads_count', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach((product) => {
      product.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price_cents >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price_cents <= filters.maxPrice!);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags!.some((tag) => p.tags?.includes(tag))
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating_average - a.rating_average);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.downloads_count - a.downloads_count);
        break;
    }

    return result;
  }, [products, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="w-16 h-16 text-zinc-700 mb-4" />
        <p className="text-zinc-400 mb-2">Failed to load products</p>
        <p className="text-zinc-500 text-sm">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section id="store-section" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              All Products
            </h2>
            <p className="text-zinc-400">
              {filteredProducts.length} products found
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            allTags={allTags}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="w-16 h-16 text-zinc-700 mb-4" />
                <p className="text-zinc-400 mb-2">No products found</p>
                <p className="text-zinc-500 text-sm">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
