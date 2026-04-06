import { useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favoriteIds?: Set<string>;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  useBasicPagination?: boolean;
  showAllProducts?: boolean;
}

/**
 * Unified Product Grid Component
 * Uses standardized Product type and ProductCard
 */
export default function ProductGrid({
  products,
  loading = false,
  error = null,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favoriteIds = new Set(),
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 3, // Default to 3 columns
  },
  useBasicPagination = false,
  showAllProducts = false,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 columns x 4 rows per page

  // Pagination logic
  const paginatedProducts = showAllProducts
    ? products
    : useBasicPagination
      ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : products;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  // Generate grid classes based on columns
  const gridClasses = [
    `grid-cols-${columns.mobile || 1}`,
    `md:grid-cols-${columns.tablet || 2}`,
    `lg:grid-cols-${columns.desktop || 3}`,
    `xl:grid-cols-${columns.large || 3}`, // Changed to 3
  ].join(" ");

  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid ${gridClasses} gap-6`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
              <div className="h-48 bg-gray-300 dark:bg-gray-600" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  // Products grid
  return (
    <div className="space-y-8">
      <div className={`grid ${gridClasses} gap-6`}>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favoriteIds.has(product.id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {useBasicPagination && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
