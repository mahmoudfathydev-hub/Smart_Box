"use client";

import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { toggleLanguage, setLanguage } from "@/redux/slices/languageSlice";
import { Language } from "@/enums/language.enum";
import { useEffect, useState } from "react";

export default function LanguageToggleButton() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.language.locale);
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ensure Redux state matches URL locale on mount and pathname changes
  useEffect(() => {
    const currentLocale = pathname.split("/")[1];
    if (
      currentLocale &&
      (currentLocale === Language.EN || currentLocale === Language.AR)
    ) {
      if (currentLocale !== locale) {
        dispatch(setLanguage(currentLocale as Language));
      }
    }
  }, [pathname, locale, dispatch]);

  const handleToggle = async () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    setIsTransitioning(true);

    const newLocale = locale === Language.EN ? Language.AR : Language.EN;

    // Update Redux state first
    dispatch(setLanguage(newLocale));

    // Small delay to ensure state is updated before navigation
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Navigate to new locale
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;

    router.push(newPath);

    // Reset transition state after navigation completes
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isTransitioning}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        isTransitioning
          ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
      }`}
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase tracking-wider text-xs font-bold">
        {locale === Language.EN ? "AR" : "EN"}
      </span>
    </button>
  );
}
