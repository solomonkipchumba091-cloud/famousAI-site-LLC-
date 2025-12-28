import React, { useState } from 'react';
import { useUIStore } from '@/lib/store';
import type { Product } from '@/types';

// Components
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { AuthModal } from '@/components/ui/AuthModal';
import { PromptPreviewModal } from '@/components/ui/PromptPreviewModal';
import { ProductDetailModal } from '@/components/ui/ProductDetailModal';

// Views
import { HeroSection } from '@/components/store/HeroSection';
import { CategoryShowcase } from '@/components/store/CategoryShowcase';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { ProductGrid } from '@/components/store/ProductGrid';
import { WorkbenchView } from '@/components/workbench/WorkbenchView';
import { DashboardView } from '@/components/dashboard/DashboardView';

const AppLayout: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const { activeView, modal, closeModal } = useUIStore();

  // Get the product for prompt preview modal
  const previewProduct = modal.type === 'prompt-runner' ? (modal.data as Product) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Main Content */}
      <main>
        {activeView === 'store' && (
          <>
            <HeroSection />
            <CategoryShowcase />
            <FeaturedProducts />
            <ProductGrid />
          </>
        )}

        {activeView === 'workbench' && <WorkbenchView />}

        {activeView === 'dashboard' && <DashboardView />}
      </main>

      {/* Footer - only show on store view */}
      {activeView === 'store' && <Footer />}

      {/* Modals & Drawers */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <PromptPreviewModal
        isOpen={modal.type === 'prompt-runner'}
        onClose={closeModal}
        product={previewProduct}
      />
      <ProductDetailModal
        isOpen={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
      />
    </div>
  );
};

export default AppLayout;
