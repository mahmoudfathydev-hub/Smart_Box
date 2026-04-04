"use client";

import { Heart } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";

export default function FavoriteIcon() {
  const locale = useAppSelector((state) => state.language.locale);

  return (
    <a
      href={`/${locale}/favorites`}
      className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all duration-300"
      aria-label="Favorites"
    >
      <Heart className="w-5 h-5" />
    </a>
  );
}
