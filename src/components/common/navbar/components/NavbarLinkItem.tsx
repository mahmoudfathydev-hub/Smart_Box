"use client";

import Link from "next/link";
import { NavbarLinkItemProps } from "@/types/navbar.types";

export default function NavbarLinkItem({ label, href }: NavbarLinkItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="relative px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
      >
        {label}
      </Link>
    </li>
  );
}
