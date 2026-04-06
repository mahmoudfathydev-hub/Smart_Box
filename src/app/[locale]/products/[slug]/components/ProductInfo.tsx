"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductVariants from "./ProductVariants";
import RatingStars from "./RatingStars";
import ShareButtons from "./ShareButtons";
import { Heart, ShoppingCart, Share2, Truck, Shield, RefreshCw } from "lucide-react";

interface ProductInfoProps {
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
  dynamicPrice: number;
  hasDiscount: boolean;
  locale: string;
}

/**
 * Product Info Component
 * Apple-style product information with variants and actions
 */
export default function ProductInfo({
  product,
  selectedVariant,
  onVariantChange,
  dynamicPrice,
  hasDiscount,
  locale,
}: ProductInfoProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isRTL = locale === "ar";
  const isInStock = product.stockQuantity && product.stockQuantity > 0;

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      addToCart: { en: "Add to Cart", ar: "أضف للسلة" },
      outOfStock: { en: "Out of Stock", ar: "نفد المخزون" },
      inStock: { en: "In Stock", ar: "متوفر" },
      sku: { en: "SKU:", ar: "رمز المنتج:" },
      brand: { en: "Brand:", ar: "العلامة التجارية:" },
      category: { en: "Category:", ar: "الفئة:" },
      freeShipping: { en: "Free Shipping", ar: "شحن مجاني" },
      warranty: { en: "1 Year Warranty", ar: "ضمان لمدة عام" },
      returns: { en: "30-Day Returns", ar: "إرجاع خلال 30 يوم" },
      quantity: { en: "Quantity:", ar: "الكمية:" },
    };
    return translations[key]?.[locale] || key;
  };

  const getLocalizedPrice = (price: number) => {
    if (locale === "ar") {
      const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return price.toFixed(2).replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)]);
    }
    return price.toFixed(2);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Adding to cart:", {
      product: product.id,
      variant: selectedVariant,
      quantity,
      price: dynamicPrice,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add to favorites logic here
  };

  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === "ar" && product.name_ar ? product.name_ar : product.name_en || product.name}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating || 0} size="sm" readonly />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.rating?.toFixed(1) || "0.0"})
            </span>
          </div>

          <Badge variant={isInStock ? "default" : "destructive"} className="text-xs">
            {isInStock ? getLocalizedText("inStock") : getLocalizedText("outOfStock")}
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            ${getLocalizedPrice(dynamicPrice)}
          </span>

          {hasDiscount && (
            <span className="text-xl text-gray-500 line-through">
              ${getLocalizedPrice(product.price)}
            </span>
          )}
        </div>

        {hasDiscount && (
          <Badge className="bg-red-500 text-white">
            {Math.round(((product.price - dynamicPrice) / product.price) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Product Variants */}
      <ProductVariants
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={onVariantChange}
        locale={locale}
      />

      {/* Quantity and Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stockQuantity || 1, quantity + 1))}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={quantity >= (product.stockQuantity || 1)}
            >
              +
            </button>
          </div>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getLocalizedText("quantity")}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={!isInStock}
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {getLocalizedText("addToCart")}
          </Button>

          <Button
            onClick={handleToggleFavorite}
            variant="outline"
            size="lg"
            className={`p-3 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>

          <ShareButtons product={product} locale={locale} />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{getLocalizedText("sku")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {product.sku || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{getLocalizedText("brand")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {locale === "ar" && product.brand_ar
                ? product.brand_ar
                : product.brand_en || product.brand}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{getLocalizedText("category")}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {locale === "ar" && product.category_ar
                ? product.category_ar
                : product.category_en || product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Truck className="w-5 h-5 text-green-500" />
            {getLocalizedText("freeShipping")}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-5 h-5 text-blue-500" />
            {getLocalizedText("warranty")}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            {getLocalizedText("returns")}
          </div>
        </div>
      </div>
    </div>
  );
}
