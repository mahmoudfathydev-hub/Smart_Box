"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { Routes } from "@/enums/routes.enum";
import { navbarDictionary as enDict } from "@/dict/common/navbar/en";
import { navbarDictionary as arDict } from "@/dict/common/navbar/ar";
import { NavbarLink } from "@/types/navbar.types";
import NavbarLinkItem from "@/components/common/navbar/components/NavbarLinkItem";

const navLinks: NavbarLink[] = [
  { key: "home", route: Routes.HOME },
  { key: "products", route: Routes.PRODUCTS },
  { key: "accessories", route: Routes.ACCESSORIES },
  { key: "compare", route: Routes.COMPARE },
  { key: "careers", route: Routes.CAREERS },
  { key: "contact", route: Routes.CONTACT },
];

export default function NavbarLinks() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const isRTL = locale === Language.AR;

  return (
    <ul className="hidden lg:flex items-center gap-1">
      {navLinks.map((link) => (
        <NavbarLinkItem
          key={link.key}
          label={dictionary[link.key]}
          href={`/${locale}${link.route === Routes.HOME ? "" : link.route}`}
        />
      ))}
    </ul>
  );
}
