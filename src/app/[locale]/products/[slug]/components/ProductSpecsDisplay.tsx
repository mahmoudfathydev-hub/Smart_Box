'use client';

import { Product } from '@/types/product';

interface ProductSpecsDisplayProps {
  specs: Array<{
    name: string;
    value: string;
  }>;
  locale: string;
}

/**
 * Product Specifications Display Component
 * Shows specifications that don't have price values
 */
export default function ProductSpecsDisplay({
  specs,
  locale,
}: ProductSpecsDisplayProps) {
  // Filter out specifications that have price values (RAM, Storage)
  const nonPricingSpecs = specs?.filter(spec => {
    const specName = spec.name.toLowerCase();
    const hasPrice = spec.value && !isNaN(parseInt(spec.value)) && parseInt(spec.value) > 0;
    
    // Exclude if it's a pricing spec (RAM/Storage with price) or if value is empty
    return !hasPrice && 
           !specName.includes('ram') && 
           !specName.includes('memory') &&
           !specName.includes('storage') &&
           !specName.includes('ssd') &&
           !specName.includes('hard drive');
  }) || [];

  if (!nonPricingSpecs || nonPricingSpecs.length === 0) {
    return null;
  }

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      specifications: { en: 'Specifications', ar: 'المواصفات' },
    };
    return translations[key]?.[locale] || key;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {getLocalizedText('specifications')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {nonPricingSpecs.map((spec, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {spec.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
