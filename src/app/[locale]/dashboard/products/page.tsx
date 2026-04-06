"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { sidebarDictionary as enDict } from "@/dict/Dashboard/common/en";
import { sidebarDictionary as arDict } from "@/dict/Dashboard/common/ar";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import ProductList from "@/components/ProductList";

export default function ProductsPage() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {dictionary.products}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your product inventory and add new items.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <Link href={`/${locale}/dashboard/add-product`}>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-full">
            <Plus className="w-4 h-4" />
            {dictionary.addProduct}
          </button>
        </Link>
      </div>

      <ProductList />
    </div>
  );
}
