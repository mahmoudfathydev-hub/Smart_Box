"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { sidebarDictionary as enDict } from "@/dict/Dashboard/common/en";
import { sidebarDictionary as arDict } from "@/dict/Dashboard/common/ar";
import { Menu, X } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({
  isCollapsed,
  onToggle,
}: SidebarHeaderProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-between ${isCollapsed ? "p-2" : "p-4"} border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">SB</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between ${isCollapsed ? "p-2" : "p-4"} border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SB</span>
        </div>
        {!isCollapsed && (
          <span className="font-semibold text-gray-900 dark:text-white">
            {dictionary.dashboard || "Control Center"}
          </span>
        )}
      </div>
      {!isMobile && (
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
