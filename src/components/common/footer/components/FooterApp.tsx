"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { Smartphone, Apple } from "lucide-react";

export default function FooterApp() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {dictionary.app.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {dictionary.app.description}
      </p>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200">
          <Apple className="w-5 h-5" />
          <div className="text-start">
            <div className="text-xs">Download on</div>
            <div className="text-sm font-semibold">App Store</div>
          </div>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200">
          <Smartphone className="w-5 h-5" />
          <div className="text-start">
            <div className="text-xs">Get it on</div>
            <div className="text-sm font-semibold">Google Play</div>
          </div>
        </button>
      </div>
    </div>
  );
}
