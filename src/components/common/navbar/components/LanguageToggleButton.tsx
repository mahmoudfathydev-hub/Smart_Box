"use client";

import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { toggleLanguage } from "@/redux/slices/languageSlice";
import { Language } from "@/enums/language.enum";

export default function LanguageToggleButton() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.language.locale);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const newLocale =
      locale === Language.EN ? Language.AR : Language.EN;

    dispatch(toggleLanguage());

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;

    router.push(newPath);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-300"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase tracking-wider text-xs font-bold">
        {locale === Language.EN ? "AR" : "EN"}
      </span>
    </button>
  );
}
