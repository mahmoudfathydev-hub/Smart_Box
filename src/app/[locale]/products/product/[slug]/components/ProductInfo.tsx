"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Badge } from "@/components/ui/badge";
import { Star, Package, CheckCircle } from "lucide-react";

interface ProductInfoProps {
  name: string;
  brand: string;
  rating: number;
  shortDescription: string;
  stockQuantity: number;
}

export default function ProductInfo({
  name,
  brand,
  rating,
  shortDescription,
  stockQuantity,
}: ProductInfoProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const isInStock = stockQuantity > 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  return (
    <div className="space-y-6">
      {/* Product Name and Brand */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {brand}
          </Badge>
          {isLowStock && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
              {dictionary.productPage.info.limitedStock.replace("{count}", stockQuantity.toString())}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          (128 {dictionary.productPage.info.reviews})
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {stockQuantity > 5 ? dictionary.productPage.info.inStock : 
               dictionary.productPage.info.limitedStock.replace("{count}", stockQuantity.toString())}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">{dictionary.productPage.info.outOfStock}</span>
          </div>
        )}
      </div>

      {/* Short Description */}
      <div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {shortDescription}
        </p>
      </div>

      {/* Product Features */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Key Features
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Premium quality materials
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            1-year warranty included
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Free shipping on orders over $50
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            30-day return policy
          </li>
        </ul>
      </div>
    </div>
  );
}
