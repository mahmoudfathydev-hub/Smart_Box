"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface NavbarContainerProps {
  children: React.ReactNode;
}

export default function NavbarContainer({ children }: NavbarContainerProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  return (
    <div
      className={`flex items-center justify-between w-full transition-all duration-300 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {children}
    </div>
  );
}
