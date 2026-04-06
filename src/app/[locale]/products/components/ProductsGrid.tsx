"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Product } from "@/redux/modules/products/types";
import ProductCard from "@/components/common/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function ProductsGrid({ products, loading, error }: ProductsGridProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" className="ml-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            {dictionary.error.retryButton}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {dictionary.empty.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {dictionary.empty.message}
        </p>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            originalPrice: product.discountPrice ? product.price : undefined,
            image: product.images[0]?.url || "",
            badge: product.discountPrice ? "Sale" : undefined,
            rating: product.rating,
            description: product.shortDescription,
          }}
        />
      ))}
    </div>
  );
}
