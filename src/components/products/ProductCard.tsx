import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

/**
 * Unified Product Card Component
 * Accepts standardized Product type
 */
export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = product.images[0] || '/images/product-placeholder.jpg';

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#3D9BD6] dark:hover:border-[#3D9BD6] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        
        {/* Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(product);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        )}

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement;
              target.src = '/images/product-placeholder.jpg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#3D9BD6] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {product.discountPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${product.discountPrice?.toFixed(2) || product.price.toFixed(2)}
              </span>
            </div>
            
            {/* Stock Status */}
            <Badge 
              variant={product.stockQuantity && product.stockQuantity > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {product.stockQuantity && product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1B3664] hover:bg-[#1B3664]/90 text-white rounded-xl transition-colors duration-200 text-sm font-medium"
                disabled={!product.stockQuantity || product.stockQuantity === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Import Button for the favorite button
import { Button } from '@/components/ui/button';
