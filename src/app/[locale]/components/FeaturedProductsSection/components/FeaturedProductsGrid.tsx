"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

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
        console.log("FeaturedProductsGrid - Fetching products...");

        // First try to get featured products
        let featuredProducts = await ProductRepository.getFeaturedProducts(8);
        console.log("FeaturedProductsGrid - Fetched featured products:", featuredProducts.length);

        // If no featured products, get random products
        if (featuredProducts.length === 0) {
          console.log("No featured products found, fetching all products...");
          const allProductsResponse = await ProductRepository.getAllProducts();
          const allProducts = allProductsResponse.products;
          console.log("FeaturedProductsGrid - Fetched all products:", allProducts.length);

          // Shuffle and select random products
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          const count = allProducts.length < 8 ? allProducts.length : 8;
          featuredProducts = shuffled.slice(0, count);
          console.log("FeaturedProductsGrid - Selected random products:", featuredProducts.length);
        }

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={(product) => console.log("Product clicked:", product.slug)}
          onAddToCart={(product) => console.log("Added to cart:", product.name)}
        />
      ))}
    </div>
  );
}
