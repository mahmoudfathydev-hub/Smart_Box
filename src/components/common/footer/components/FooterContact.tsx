"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function FooterContact() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {dictionary.contact.title}
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-400">
            {dictionary.contact.address}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-400 font-sans" dir="ltr">
            {dictionary.contact.phone}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-400">
            {dictionary.contact.email}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 dark:text-gray-400">
            {dictionary.contact.hours}
          </span>
        </div>
      </div>
    </div>
  );
}
