"use client";

import { Product } from '@/types/product';
import OptimizedProductsGrid from './OptimizedProductsGrid';
import ProductGrid from './ProductGrid';

interface ProductsGridClientProps {
  products: Product[];
  totalItems: number;
}

/**
 * Client Component Wrapper for Product Grids
 * Handles client-side interactivity while allowing server-side data fetching
 */
export default function ProductsGridClient({ products, totalItems }: ProductsGridClientProps) {
  // Use optimized grid for large datasets, regular grid for smaller ones
  if (totalItems > 50) {
    return <OptimizedProductsGrid products={products} loading={false} error={null} />;
  }

  return <ProductGrid products={products} loading={false} error={null} />;
}
