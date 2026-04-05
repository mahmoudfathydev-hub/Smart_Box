"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import NavbarLogo from "@/components/common/navbar/components/NavbarLogo";
import NavbarLinks from "@/components/common/navbar/components/NavbarLinks";
import NavbarActions from "@/components/common/navbar/components/NavbarActions";

export default function Navbar() {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 items-center justify-between ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Logo - Left in LTR, Right in RTL */}
          <div className={isRTL ? "order-3" : "order-1"}>
            <NavbarLogo />
          </div>

          {/* Links - Center */}
          <div className="order-2 flex-1 flex justify-center">
            <NavbarLinks />
          </div>

          {/* Actions - Right in LTR, Left in RTL */}
          <div className={isRTL ? "order-1" : "order-3"}>
            <NavbarActions />
          </div>
        </div>
      </div>
    </nav>
  );
}
