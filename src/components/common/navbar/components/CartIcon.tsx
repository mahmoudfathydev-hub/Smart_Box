"use client";

import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";

export default function CartIcon() {
  const locale = useAppSelector((state) => state.language.locale);

  return (
    <a
      href={`/${locale}/cart`}
      className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-300"
      aria-label="Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm">
        0
      </span>
    </a>
  );
}
