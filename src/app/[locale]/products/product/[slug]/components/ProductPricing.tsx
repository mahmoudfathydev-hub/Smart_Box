"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Badge } from "@/components/ui/badge";
import { Truck, Tag } from "lucide-react";

interface ProductPricingProps {
  price: number;
  discountPrice?: number;
  currency: string;
}

export default function ProductPricing({
  price,
  discountPrice,
  currency,
}: ProductPricingProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  const currentPrice = discountPrice || price;

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {currency}{currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              {currency}{price.toFixed(2)}
            </span>
          )}
        </div>
        
        {hasDiscount && (
          <Badge className="bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Savings Information */}
      {hasDiscount && (
        <div className="flex items-center gap-2 text-green-600">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">
            {dictionary.productPage.pricing.youSave}: {currency}{(price - discountPrice!).toFixed(2)}
          </span>
        </div>
      )}

      {/* Additional Pricing Info */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          <span>{dictionary.productPage.pricing.shipping}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center text-xs">📋</span>
          <span>{dictionary.productPage.pricing.tax}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Price Details
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {dictionary.productPage.pricing.regularPrice}
            </span>
            <span className={hasDiscount ? "text-gray-500 line-through" : "font-medium"}>
              {currency}{price.toFixed(2)}
            </span>
          </div>
          
          {hasDiscount && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {dictionary.productPage.pricing.discount}
                </span>
                <span className="text-green-600 font-medium">
                  -{currency}{(price - discountPrice!).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {dictionary.productPage.pricing.salePrice}
                </span>
                <span className="font-bold text-lg">
                  {currency}{discountPrice!.toFixed(2)}
                </span>
              </div>
            </>
          )}
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                Total
              </span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {currency}{currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
