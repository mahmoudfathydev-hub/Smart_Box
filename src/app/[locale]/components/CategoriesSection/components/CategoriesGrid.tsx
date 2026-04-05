"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { categoriesDictionary as enDict } from "@/dict/Home/Categories/en";
import { categoriesDictionary as arDict } from "@/dict/Home/Categories/ar";
import {
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  Cpu,
  Watch,
} from "lucide-react";

export default function CategoriesGrid() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      "📱": Smartphone,
      tablet: Tablet,
      "💻": Laptop,
      "🎧": Headphones,
      "🔧": Cpu,
      "⌚": Watch,
    };
    return iconMap[iconName] || Smartphone;
  };

  const categoriesItems = dictionary.categories.map((category) => {
    const IconComponent = getIcon(category.icon);
    return {
      title: category.name,
      description: category.description,
      link: `/${locale}/categories/${category.id}`,
      icon: <IconComponent className="w-8 h-8 text-white" />,
    };
  });

  return (
    <div className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {dictionary.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {dictionary.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <HoverEffect items={categoriesItems} className="w-full" />
      </div>
    </div>
  );
}
