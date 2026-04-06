"use client";

import { Product } from "@/types/product";

interface ProductVariantsProps {
  product: Product;
  selectedVariant: {
    color?: { name: string; hex: string };
    storage?: { label: string; priceModifier: number };
    ram?: { label: string; priceModifier: number };
    [key: string]:
      | { label: string; priceModifier: number }
      | { name: string; hex: string }
      | undefined;
  };
  onVariantChange: (variant: any) => void;
  locale: string;
}

/**
 * Product Variants Component
 * Apple-style variant selectors for colors and storage
 */
export default function ProductVariants({
  product,
  selectedVariant,
  onVariantChange,
  locale,
}: ProductVariantsProps) {
  // Extract colors from product data or use defaults
  const getColors = () => {
    // Always include default colors
    const defaultColors = [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
    ];

    // Skip all colors for hardware category if needed
    const category = product.category_en || product.category || "";
    if (category.toLowerCase().includes("hardware")) {
      return [];
    }

    return defaultColors;
  };

  // Extract storage variants from product data
  const getStorageVariants = () => {
    const storageVariants: { label: string; priceModifier: number }[] = [];

    // Try to get custom storage variants from product specs first
    if (product.specs) {
      product.specs.forEach((spec) => {
        const specName = spec.name.toLowerCase();
        if (
          specName.includes("storage") ||
          specName.includes("ssd") ||
          specName.includes("hard drive")
        ) {
          // Extract label from spec name (e.g., "storage: 1TB SSD" -> "1TB SSD")
          const label = spec.name.replace(/^(storage|ssd|hard drive)?\s*:?s*/i, "").trim();
          // Parse price from spec value (empty string = 0, "250" = 250)
          const priceModifier = parseInt(spec.value) || 0;

          // Only include if there's a valid label
          if (label) {
            storageVariants.push({
              label,
              priceModifier,
            });
          }
        }
      });
    }

    return storageVariants;
  };

  // Extract RAM variants from product data
  const getRamVariants = () => {
    const ramVariants: { label: string; priceModifier: number }[] = [];

    // Try to get custom RAM variants from product specs first
    if (product.specs) {
      product.specs.forEach((spec) => {
        const specName = spec.name.toLowerCase();
        if (specName.includes("ram") || specName.includes("memory")) {
          // Extract label from spec name (e.g., "ram: 32GB" -> "32GB")
          const label = spec.name.replace(/^(ram|memory)?\s*:?s*/i, "").trim();
          // Parse price from spec value (empty string = 0, "150" = 150)
          const priceModifier = parseInt(spec.value) || 0;

          // Only include if there's a valid label
          if (label) {
            ramVariants.push({
              label,
              priceModifier,
            });
          }
        }
      });
    }

    return ramVariants;
  };

  const colors = getColors();
  const storageVariants = getStorageVariants();
  const ramVariants = getRamVariants();

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      chooseColor: { en: "Choose Color:", ar: "اختر اللون:" },
      chooseStorage: { en: "Choose Storage:", ar: "اختر السعة:" },
      chooseRam: { en: "Choose RAM:", ar: "اختر الذاكرة:" },
    };
    return translations[key]?.[locale] || key;
  };

  const handleColorChange = (color: { name: string; hex: string }) => {
    onVariantChange({
      ...selectedVariant,
      color,
    });
  };

  const handleStorageChange = (storage: { label: string; priceModifier: number }) => {
    onVariantChange({
      ...selectedVariant,
      storage,
    });
  };

  const handleRamChange = (ram: { label: string; priceModifier: number }) => {
    onVariantChange({
      ...selectedVariant,
      ram,
    });
  };

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {getLocalizedText("chooseColor")}
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  selectedVariant.color?.name === color.name
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                title={color.name}
              >
                <div
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: color.hex }}
                />
                {selectedVariant.color?.name === color.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedVariant.color && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVariant.color.name}</p>
          )}
        </div>
      )}

      {/* Storage Selector */}
      {storageVariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {getLocalizedText("chooseStorage")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {storageVariants.map((storage) => (
              <button
                key={storage.label}
                onClick={() => handleStorageChange(storage)}
                className={`relative px-4 py-3 rounded-lg border-2 text-center transition-all ${
                  selectedVariant.storage?.label === storage.label
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium">{storage.label}</div>
                {storage.priceModifier > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    +${storage.priceModifier}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RAM Selector */}
      {ramVariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {getLocalizedText("chooseRam")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ramVariants.map((ram) => (
              <button
                key={ram.label}
                onClick={() => handleRamChange(ram)}
                className={`relative px-4 py-3 rounded-lg border-2 text-center transition-all ${
                  selectedVariant.ram?.label === ram.label
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium">{ram.label}</div>
                {ram.priceModifier > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    +${ram.priceModifier}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
