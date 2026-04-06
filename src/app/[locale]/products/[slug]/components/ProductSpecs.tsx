"use client";

import { Package, Weight, Ruler } from "lucide-react";

interface ProductSpecsProps {
  specs: Array<{ name: string; value: string }>;
  locale: string;
}

/**
 * Product Specifications Component
 * Displays product specifications in a clean table format
 */
export default function ProductSpecs({ specs, locale }: ProductSpecsProps) {
  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      specifications: { en: "Specifications", ar: "المواصفات" },
      weight: { en: "Weight", ar: "الوزن" },
      dimensions: { en: "Dimensions", ar: "الأبعاد" },
    };
    return translations[key]?.[locale] || key;
  };

  const getSpecIcon = (specName: string) => {
    const name = specName.toLowerCase();
    if (name.includes("weight") || name.includes("وزن")) {
      return Weight;
    }
    if (name.includes("dimension") || name.includes("size") || name.includes("أبعاد")) {
      return Ruler;
    }
    return Package;
  };

  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <Package className="w-5 h-5" />
        {getLocalizedText("specifications")}
      </h3>

      <div className="space-y-3">
        {specs.map((spec, index) => {
          const Icon = getSpecIcon(spec.name);
          return (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {spec.name}
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {spec.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
