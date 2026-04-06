"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Product } from "@/redux/modules/products/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Package,
  Shield,
  RotateCcw,
  Truck,
} from "lucide-react";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isInStock = product.stockQuantity > 0;
  const maxQuantity = Math.min(product.stockQuantity, 10); // Limit to 10 for UI

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      productId: product.id,
      quantity,
      price: product.discountPrice || product.price,
    });
    // This would dispatch an action to add to cart
  };

  const handleBuyNow = () => {
    console.log("Buy now:", {
      productId: product.id,
      quantity,
      price: product.discountPrice || product.price,
    });
    // This would navigate to checkout
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log("Toggle wishlist:", {
      productId: product.id,
      isWishlisted: !isWishlisted,
    });
    // This would dispatch an action to toggle wishlist
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {dictionary.productPage.actions.quantity}
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="px-3"
            aria-label={dictionary.productPage.actions.decrease}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-20 text-center"
            min={1}
            max={maxQuantity}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity}
            className="px-3"
            aria-label={dictionary.productPage.actions.increase}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {maxQuantity < 10 && (
          <p className="text-xs text-gray-500">
            {dictionary.productPage.info.limitedStock.replace(
              "{count}",
              product.stockQuantity.toString(),
            )}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className="w-full gap-2"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5" />
          {dictionary.productPage.actions.addToCart}
        </Button>

        <Button
          onClick={handleBuyNow}
          disabled={!isInStock}
          variant="outline"
          className="w-full gap-2"
          size="lg"
        >
          <Package className="w-5 h-5" />
          {dictionary.productPage.actions.buyNow}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleToggleWishlist}
          className="flex-1 gap-2"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
          {isWishlisted
            ? dictionary.productPage.actions.removeFromWishlist
            : dictionary.productPage.actions.addToWishlist}
        </Button>

        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          {dictionary.productPage.actions.share}
        </Button>
      </div>

      <Separator />

      {/* Trust Badges */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Why buy from us?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                Free Shipping
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                On orders over $50
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                Secure Payment
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                100% secure transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                Easy Returns
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Warning */}
      {!isInStock && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">
              {dictionary.productPage.info.outOfStock}
            </span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            This item is currently out of stock. Check back later or contact us
            for availability.
          </p>
        </div>
      )}
    </div>
  );
}
