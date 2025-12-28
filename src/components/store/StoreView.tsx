import React from 'react';
import { HeroSection } from './HeroSection';
import { CategoryShowcase } from './CategoryShowcase';
import { FeaturedProducts } from './FeaturedProducts';
import { ProductGrid } from './ProductGrid';

export const StoreView: React.FC = () => {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <ProductGrid />
    </>
  );
};
