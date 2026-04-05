"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLinkProps } from "../types";

export default function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;

  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
