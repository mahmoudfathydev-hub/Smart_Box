"use client";

import FeaturedProductsGrid from "./components/FeaturedProductsGrid";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";

export default function FeaturedProductsSection() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {dictionary.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {dictionary.subtitle}
          </p>
        </div>

        <FeaturedProductsGrid />
      </div>
    </section>
  );
}
