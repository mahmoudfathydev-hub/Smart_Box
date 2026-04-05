"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLinkProps } from "../types";

export default function SidebarLink({
  href,
  icon,
  label,
  isActive,
  isCollapsed,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;

  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-2 py-3 rounded-lg transition-colors duration-200 group relative",
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
        isCollapsed ? "justify-center" : "",
      )}
    >
      <div className={cn("flex-shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")}>
        {icon}
      </div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {label}
        </span>
      )}
    </a>
  );
}
