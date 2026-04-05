"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { FooterLinkProps } from "../types";

interface FooterAboutProps {
  FooterLink: ({ href, children }: FooterLinkProps) => React.ReactElement;
}

export default function FooterAbout({ FooterLink }: FooterAboutProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {dictionary.about.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {dictionary.about.description}
      </p>
      <FooterLink href="/about">{dictionary.about.link}</FooterLink>
    </div>
  );
}
