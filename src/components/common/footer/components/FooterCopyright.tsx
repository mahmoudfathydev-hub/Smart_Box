"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { Heart } from "lucide-react";

export default function FooterCopyright() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {dictionary.copyright.text}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
          {dictionary.copyright.madeWith}
          <Heart className="w-4 h-4 text-red-500" />
        </p>
      </div>
    </div>
  );
}
