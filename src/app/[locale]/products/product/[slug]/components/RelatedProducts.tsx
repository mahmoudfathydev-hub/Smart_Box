"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Product } from "@/redux/modules/products/types";
import ProductSwiper from "@/components/common/ProductSwiper/ProductSwiper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RelatedProductsProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function RelatedProducts({ products, loading, error }: RelatedProductsProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Transform products for ProductCard component
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.discountPrice || product.price,
    originalPrice: product.discountPrice ? product.price : undefined,
    image: product.images[0]?.url || "",
    badge: product.discountPrice ? "Sale" : undefined,
    rating: product.rating,
    description: product.shortDescription,
  }));

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {dictionary.productPage.relatedProducts.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load related products. {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {dictionary.productPage.relatedProducts.noRelated}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Check out our other products that might interest you.
        </p>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {dictionary.productPage.relatedProducts.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {dictionary.productPage.relatedProducts.subtitle}
          </p>
        </div>
        
        {products.length > 0 && (
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              {dictionary.productPage.relatedProducts.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Swiper */}
      <div className="relative">
        <ProductSwiper
          products={transformedProducts}
          isRTL={locale === "ar"}
        />
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Looking for more options?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore our full collection of products with similar features and styles.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/products">
              <Button variant="outline">
                All Products
              </Button>
            </Link>
            <Link href="/products?sale=true">
              <Button>
                On Sale
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
