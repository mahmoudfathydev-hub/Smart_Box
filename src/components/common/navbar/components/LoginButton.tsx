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
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <LogIn className="w-4 h-4" />
      {dictionary.login}
    </a>
  );
}
