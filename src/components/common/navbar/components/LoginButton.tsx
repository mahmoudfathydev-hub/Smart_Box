"use client";

import { LogIn } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { navbarDictionary as enDict } from "@/dict/common/navbar/en";
import { navbarDictionary as arDict } from "@/dict/common/navbar/ar";

export default function LoginButton() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <a
      href={`/${locale}/auth`}
      className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#1B3664] hover:bg-[#3D9BD6] border border-[#B2B9C0]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">{dictionary.login}</span>
    </a>
  );
}
