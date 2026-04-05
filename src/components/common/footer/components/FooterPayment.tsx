"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { CreditCard } from "lucide-react";

export default function FooterPayment() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {dictionary.payment.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {dictionary.payment.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-gray-400" />
          <div className="flex gap-2">
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
              VISA
            </div>
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
              MC
            </div>
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
              AMEX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
