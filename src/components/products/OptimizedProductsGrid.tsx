import React, { useMemo, useCallback } from "react";
import VirtualizedGrid from "@/components/common/VirtualizedGrid";
import LazyImage from "@/components/common/LazyImage";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";

interface OptimizedProductsGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favorites?: Set<string>;
  itemHeight?: number;
  containerHeight?: number;
}

const OptimizedProductsGrid: React.FC<OptimizedProductsGridProps> = ({
  products,
  loading = false,
  error = null,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites = new Set(),
  itemHeight = 400,
  containerHeight = 600,
}) => {
  const renderProductCard = useCallback(
    (product: Product, index: number, style: React.CSSProperties) => {
      const isFavorite = favorites.has(product.id);
      const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

      const imageUrl = product.images[0]?.url || "/images/product-placeholder.jpg";

      return (
        <div style={style} className="p-2">
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="relative">
              <LazyImage
                src={imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                placeholder="/images/product-placeholder.jpg"
                onClick={() => onProductClick?.(product)}
              />

              {discountPercentage > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500">-{discountPercentage}%</Badge>
              )}

              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product);
                  }}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.price}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      product.stockQuantity && product.stockQuantity > 0 ? "default" : "destructive"
                    }
                    className="text-xs"
                  >
                    {product.stockQuantity && product.stockQuantity > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </Badge>

                  {onAddToCart && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      disabled={!product.stockQuantity || product.stockQuantity === 0}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    },
    [favorites, onProductClick, onAddToCart, onToggleFavorite],
  );

  // Memoize grid items to prevent unnecessary recalculations
  const gridItems = useMemo(() => products, [products]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
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
  if (gridItems.length === 0) {
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

  // Use virtualized grid for large datasets, regular grid for smaller ones
  if (gridItems.length > 50) {
    return (
      <VirtualizedGrid
        items={gridItems}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderProductCard}
        className="optimized-products-grid"
      />
    );
  }

  // Regular grid for smaller datasets
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {gridItems.map((product, index) => (
        <div key={product.id}>{renderProductCard(product, index, {} as React.CSSProperties)}</div>
      ))}
    </div>
  );
};

export default OptimizedProductsGrid;
