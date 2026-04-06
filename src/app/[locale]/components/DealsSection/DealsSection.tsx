"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

export default function DealsSection() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDealsProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("DealsSection - Fetching products...");

        // First try to get products on sale
        let dealsProducts = await ProductRepository.getProductsOnSale(8);
        console.log("DealsSection - Fetched sale products:", dealsProducts.length);

        // If no sale products, get random products
        if (dealsProducts.length === 0) {
          console.log("No sale products found, fetching all products...");
          const allProductsResponse = await ProductRepository.getAllProducts();
          const allProducts = allProductsResponse.products;
          console.log("DealsSection - Fetched all products:", allProducts.length);

          // Shuffle and select random products
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          const count = allProducts.length < 8 ? allProducts.length : 8;
          dealsProducts = shuffled.slice(0, count);
          console.log("DealsSection - Selected random products:", dealsProducts.length);
        }

        setProducts(dealsProducts);
      } catch (err) {
        console.error("Failed to fetch deals products:", err);
        setError(err instanceof Error ? err.message : "Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDealsProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === Language.AR ? "العروض المميزة" : "Hot Deals"}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {locale === Language.AR
                ? "اكتشف أفضل العروض والخصومات على المنتجات المميزة"
                : "Discover amazing deals and discounts on premium products"}
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D9BD6]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === Language.AR ? "العروض المميزة" : "Hot Deals"}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {locale === Language.AR
                ? "اكتشف أفضل العروض والخصومات على المنتجات المميزة"
                : "Discover amazing deals and discounts on premium products"}
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">{dictionary.error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === Language.AR ? "العروض المميزة" : "Hot Deals"}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {locale === Language.AR
              ? "اكتشف أفضل العروض والخصومات على المنتجات المميزة"
              : "Discover amazing deals and discounts on premium products"}
          </p>
        </div>

        {/* Products Grid */}
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
      </div>
    </section>
  );
}
