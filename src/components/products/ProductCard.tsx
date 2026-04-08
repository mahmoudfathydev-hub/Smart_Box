import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { useEffect } from "react";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

/**
 * Unified Product Card Component
 * Accepts standardized Product type with Arabic language support
 */
export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log("ProductCard - Product data:", product);
    console.log("ProductCard - Price:", product.price);
    console.log("ProductCard - Discount Price:", product.discountPrice);
  }, [product]);

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = product.images[0]?.url || "/images/product-placeholder.svg";

  // Get localized content with character limits
  const getName = () => {
    const name =
      locale === Language.AR && product.name_ar
        ? product.name_ar
        : product.name_en || product.name || "Unnamed Product";
    return name.length > 30 ? name.substring(0, 25) + "..." : name;
  };

  const getDescription = () => {
    const description =
      locale === Language.AR && product.description_ar
        ? product.description_ar
        : product.description_en || product.description;
    return description && description.length > 60
      ? description.substring(0, 60) + "..."
      : description;
  };

  const getCategory = () => {
    if (locale === Language.AR && product.category_ar) return product.category_ar;
    return product.category_en || product.category;
  };

  const getStockStatus = () => {
    if (!product.stockQuantity || product.stockQuantity === 0) {
      return locale === Language.AR ? "نفد المخزون" : "Out of Stock";
    }
    return locale === Language.AR ? "متوفر" : "In Stock";
  };

  const getLocalizedPrice = (price: number) => {
    if (locale === Language.AR) {
      const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return price.toFixed(2).replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)]);
    }
    return price.toFixed(2);
  };

  const getLocalizedCurrency = () => {
    return locale === Language.AR ? "دولار" : "USD";
  };

  const getAddToCartText = () => {
    return locale === Language.AR ? "أضف للسلة" : "Add to Cart";
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#3D9BD6] dark:hover:border-[#3D9BD6] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[450px] ${isRTL ? "text-right" : "text-left"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-purple-500/3 pointer-events-none" />

        {discountPercentage > 0 && (
          <div className={`absolute top-4 z-20 ${isRTL ? "right-4" : "left-4"}`}>
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold border-0">
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src={imageUrl}
            alt={getName()}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/product-placeholder.jpg";
            }}
          />
        </div>

        <div className="p-4 relative flex flex-col h-full">
          <div className="mb-2">
            {getCategory() && (
              <Badge
                variant="secondary"
                className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900 dark:to-blue-800 dark:text-blue-200 border-0 px-2 py-1 rounded-full"
              >
                {getCategory()}
              </Badge>
            )}
          </div>

          <div className="mb-2 h-[3rem]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#3D9BD6] transition-colors duration-300 line-clamp-2 leading-tight">
              {getName()}
            </h3>
          </div>

          <div className="mb-3 h-[2.5rem]">
            {getDescription() ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {getDescription()}
              </p>
            ) : (
              <div className="h-[2.5rem]"></div>
            )}
          </div>

          <div className="flex-grow"></div>

          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-end ${isRTL ? "space-x-reverse space-x-0" : "space-x-0"}`}>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-500 line-through font-medium pb-1">
                  ${getLocalizedPrice(product.price)}
                </span>
              )}
              <div className="flex flex-row items-center">
                <span className="text-xl font-black text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  $ {getLocalizedPrice(product.discountPrice || product.price || 0)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
                  {getLocalizedCurrency()}
                </span>
              </div>
            </div>

            <Badge
              variant={
                product.stockQuantity && product.stockQuantity > 0 ? "default" : "destructive"
              }
              className={`text-xs font-bold px-2 py-1 rounded-full border-0 ${
                product.stockQuantity && product.stockQuantity > 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
              }`}
            >
              {getStockStatus()}
            </Badge>
          </div>

          <div className="flex gap-2">
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1B3664] via-[#2A4A8C] to-[#3D9BD6] hover:from-[#1B3664]/90 hover:via-[#2A4A8C]/90 hover:to-[#3D9BD6]/90 text-white rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0 ${isRTL ? "flex-row-reverse" : ""}`}
                disabled={!product.stockQuantity || product.stockQuantity === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                {getAddToCartText()}
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1B3664] via-[#3D9BD6] to-[#1B3664] opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100" />
        </div>
      </div>
    </Link>
  );
}
