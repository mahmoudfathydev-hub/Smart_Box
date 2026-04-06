"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { Product } from "@/types/product";
import ProductSwiper from "@/components/products/ProductSwiper";

export default function FeaturedProductsGrid() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const featuredProducts = await ProductRepository.getFeaturedProducts(8);
        setProducts(featuredProducts);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError(err instanceof Error ? err.message : dictionary.error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [dictionary.error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D9BD6] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{dictionary.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{dictionary.error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{dictionary.empty}</p>
        </div>
      </div>
    );
  }

  return <ProductSwiper products={products} isRTL={isRTL} />;
}
