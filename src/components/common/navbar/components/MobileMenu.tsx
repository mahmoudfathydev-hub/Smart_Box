"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { Routes } from "@/enums/routes.enum";
import { navbarDictionary as enDict } from "@/dict/common/navbar/en";
import { navbarDictionary as arDict } from "@/dict/common/navbar/ar";
import { NavbarLink } from "@/types/navbar.types";
import Link from "next/link";
import NavbarButtons from "@/components/common/navbar/components/NavbarButtons";
import Image from "next/image";

const navLinks: NavbarLink[] = [
  { key: "home", route: Routes.HOME },
  { key: "products", route: Routes.PRODUCTS },
  { key: "accessories", route: Routes.ACCESSORIES },
  { key: "compare", route: Routes.COMPARE },
  { key: "careers", route: Routes.CAREERS },
  { key: "contact", route: Routes.CONTACT },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} w-full h-full bg-white dark:bg-gray-950 shadow-xl flex flex-col z-50`}>
            <div
              className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Image src="/logo.png" alt="SmartBox" width={100} height={100} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 h-[500px] p-2">
              <ul className="space-y-1 flex flex-col">
                {navLinks.map((link) => {
                  const href = `/${locale}${link.route === Routes.HOME ? "" : link.route}`;
                  return (
                    <li key={link.key}>
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`block w-full px-4 py-6 text-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-900 border-b border-gray-200 dark:border-gray-700 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {dictionary[link.key]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <NavbarButtons />
            </div>
          </div>

          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </>
  );
}
