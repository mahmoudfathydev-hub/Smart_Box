"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface DirectionProviderProps {
  children: React.ReactNode;
}

export default function DirectionProvider({ children }: DirectionProviderProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    
    // Add RTL class to body for CSS targeting
    if (isRTL) {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [locale, isRTL]);

  return <>{children}</>;
}
