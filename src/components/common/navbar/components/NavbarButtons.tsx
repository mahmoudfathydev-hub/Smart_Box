"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { setTheme } from "@/redux/slices/themeSlice";
import { Theme } from "@/enums/theme.enum";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import LanguageToggleButton from "@/components/common/navbar/components/LanguageToggleButton";
import LoginButton from "@/components/common/navbar/components/LoginButton";

export default function NavbarButtons() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      dispatch(setTheme(isDark ? Theme.DARK : Theme.LIGHT));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <div className="flex items-center gap-2">
      <LoginButton />
      <LanguageToggleButton />
      <AnimatedThemeToggler className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all duration-300 cursor-pointer" />
    </div>
  );
}
