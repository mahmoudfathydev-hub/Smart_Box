"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { commonDictionary as enDict } from "@/dict/common/en";
import { commonDictionary as arDict } from "@/dict/common/ar";
import { useState, useEffect } from "react";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number | undefined;
  description?: string;
}

// Helper function to validate and fix URLs
const getValidImageUrl = (imageUrl: string, fallbackId: string): string => {
  console.log(
    `getValidImageUrl - Input URL: "${imageUrl}" for product: ${fallbackId}`,
  );

  if (!imageUrl || imageUrl.trim() === "") {
    console.log(
      `getValidImageUrl - Empty URL, using fallback for ${fallbackId}`,
    );
    return `https://picsum.photos/seed/${fallbackId}/300/200.jpg`;
  }

  // If it's already a valid URL (starts with http), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    console.log(`getValidImageUrl - Valid HTTP URL: ${imageUrl}`);
    return imageUrl;
  }

  // If it's a relative path starting with /, assume it's valid
  if (imageUrl.startsWith("/")) {
    console.log(`getValidImageUrl - Valid relative path: ${imageUrl}`);
    return imageUrl;
  }

  // Otherwise, treat it as invalid and use fallback
  console.log(
    `getValidImageUrl - Invalid URL format, using fallback for ${fallbackId}`,
  );
  return `https://picsum.photos/seed/${fallbackId}/300/200.jpg`;
};

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    console.log(`ProductCard useEffect - Product ID: ${product.id}`);
    console.log(
      `ProductCard useEffect - Original image from props: "${product.image}"`,
    );

    const validUrl = getValidImageUrl(product.image, product.id || "default");
    console.log(`ProductCard useEffect - Validated URL: "${validUrl}"`);

    setImageSrc(validUrl);
    setImageError(false);
  }, [product.image, product.id]);

  const handleImageError = () => {
    console.log(
      `ProductCard handleImageError - Image failed to load for product: ${product.id}`,
    );
    console.log(
      `ProductCard handleImageError - Current imageSrc: "${imageSrc}"`,
    );

    if (!imageError) {
      setImageError(true);
      const fallbackUrl = `https://picsum.photos/seed/fallback-${product.id || "default"}/300/200.jpg`;
      console.log(
        `ProductCard handleImageError - Setting fallback URL: "${fallbackUrl}"`,
      );
      setImageSrc(fallbackUrl);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#3D9BD6] dark:hover:border-[#3D9BD6] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant="secondary"
              className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {product.badge}
            </Badge>
          </div>
        )}

        <div className="relative h-48 overflow-hidden">
          {imageSrc && (
            <>
              {console.log(
                `ProductCard Image component - About to render image for product ${product.id} with src: "${imageSrc}"`,
              )}
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
                onError={handleImageError}
                unoptimized={imageSrc.startsWith("https://picsum.photos")}
              />
            </>
          )}
          {!imageSrc && (
            <>
              {console.log(
                `ProductCard Image component - No imageSrc available for product ${product.id}`,
              )}
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  No Image
                </span>
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#3D9BD6] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {product.description}
            </p>
          )}

          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < (product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Add to cart:", product.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1B3664] hover:bg-[#1B3664]/90 text-white rounded-xl transition-colors duration-200 text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              {dictionary.addToCart}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Add to favorites:", product.id);
              }}
              className="flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-colors duration-200"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
