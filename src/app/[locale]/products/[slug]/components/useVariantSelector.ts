"use client";

import { useState, useCallback, useMemo } from "react";
import { Product } from "@/types/product";

interface ProductVariant {
  color?: { name: string; hex: string };
  storage?: { label: string; priceModifier: number };
}

interface UseVariantSelectorOptions {
  product: Product;
  initialVariant?: ProductVariant;
}

interface UseVariantSelectorReturn {
  selectedVariant: ProductVariant;
  availableColors: Array<{ name: string; hex: string }>;
  availableStorage: Array<{ label: string; priceModifier: number }>;
  dynamicPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  selectColor: (color: { name: string; hex: string }) => void;
  selectStorage: (storage: { label: string; priceModifier: number }) => void;
  resetVariant: () => void;
  isVariantAvailable: boolean;
}

/**
 * Custom hook for managing product variants
 * Handles variant selection, price calculation, and availability
 */
export function useVariantSelector({
  product,
  initialVariant = {},
}: UseVariantSelectorOptions): UseVariantSelectorReturn {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);

  // Extract available colors from product data
  const availableColors = useMemo(() => {
    // Try to get colors from product specs or other fields
    const defaultColors = [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
    ];

    // Skip default colors for hardware category
    const category = product.category_en || product.category || "";
    if (category.toLowerCase().includes("hardware")) {
      return [];
    }

    return defaultColors;
  }, [product.category_en, product.category]);

  // Extract available storage variants
  const availableStorage = useMemo(() => {
    // This would come from the product's variants JSON field
    // For now, we'll use common storage options based on product type
    const commonStorage = [
      { label: "128GB", priceModifier: 0 },
      { label: "256GB", priceModifier: 100 },
      { label: "512GB", priceModifier: 300 },
      { label: "1TB", priceModifier: 600 },
    ];

    // Filter storage options based on product type/price range
    if (product.price < 500) {
      return commonStorage.slice(0, 2); // Only 128GB and 256GB for budget products
    } else if (product.price < 1000) {
      return commonStorage.slice(0, 3); // Up to 512GB for mid-range products
    }
    return commonStorage; // All options for premium products
  }, [product.price]);

  // Calculate dynamic price based on selected variant
  const dynamicPrice = useMemo(() => {
    let basePrice = product.price;

    if (selectedVariant.storage) {
      basePrice += selectedVariant.storage.priceModifier;
    }

    return basePrice;
  }, [product.price, selectedVariant.storage]);

  // Calculate discount information
  const { hasDiscount, discountPercentage } = useMemo(() => {
    if (!product.discountPrice) {
      return { hasDiscount: false, discountPercentage: 0 };
    }

    const originalPrice = product.price;
    const currentPrice = dynamicPrice;
    const hasDiscountValue = currentPrice < originalPrice;
    const percentage = hasDiscountValue
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

    return { hasDiscount: hasDiscountValue, discountPercentage: percentage };
  }, [product.price, product.discountPrice, dynamicPrice]);

  // Check if variant is available (in stock)
  const isVariantAvailable = useCallback(() => {
    return product.stockQuantity && product.stockQuantity > 0;
  }, [product.stockQuantity]);

  // Select color
  const selectColor = useCallback((color: { name: string; hex: string }) => {
    setSelectedVariant((prev) => ({
      ...prev,
      color,
    }));
  }, []);

  // Select storage
  const selectStorage = useCallback((storage: { label: string; priceModifier: number }) => {
    setSelectedVariant((prev) => ({
      ...prev,
      storage,
    }));
  }, []);

  // Reset variant to default
  const resetVariant = useCallback(() => {
    setSelectedVariant({});
  }, []);

  return {
    selectedVariant,
    availableColors,
    availableStorage,
    dynamicPrice,
    hasDiscount,
    discountPercentage,
    selectColor,
    selectStorage,
    resetVariant,
    isVariantAvailable: isVariantAvailable() || false,
  };
}
