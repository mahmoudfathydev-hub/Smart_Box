'use client';

import { Product } from '@/types/product';
import ProductGrid from '@/components/products/ProductGrid';

interface RelatedProductsProps {
  products: Product[];
  locale: string;
}

/**
 * Related Products Component
 * Displays related products using existing ProductGrid
 */
export default function RelatedProducts({ products, locale }: RelatedProductsProps) {
  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      relatedProducts: { en: 'Related Products', ar: 'منتجات ذات صلة' },
      youMayAlsoLike: { en: 'You May Also Like', ar: 'قد يعجبك أيضاً' },
    };
    return translations[key]?.[locale] || key;
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getLocalizedText('relatedProducts')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {getLocalizedText('youMayAlsoLike')}
        </p>
      </div>
      
      <ProductGrid
        products={products}
        columns={{
          mobile: 1,
          tablet: 2,
          desktop: 3,
          large: 4,
        }}
        showAllProducts={true}
      />
    </div>
  );
}
