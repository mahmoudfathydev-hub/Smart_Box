"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { FooterLinkProps } from "../types";

interface FooterLinksProps {
  FooterLink: ({ href, children }: FooterLinkProps) => React.ReactElement;
}

export default function FooterLinks({ FooterLink }: FooterLinksProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {dictionary.quickLinks.title}
        </h3>
        <ul className="space-y-2">
          {Object.entries(dictionary.quickLinks.links).map(([key, value]) => (
            <li key={key}>
              <FooterLink href={`/${key}`}>{value}</FooterLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {dictionary.customerService.title}
        </h3>
        <ul className="space-y-2">
          {Object.entries(dictionary.customerService.links).map(([key, value]) => (
            <li key={key}>
              <FooterLink href={`/${key}`}>{value}</FooterLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
