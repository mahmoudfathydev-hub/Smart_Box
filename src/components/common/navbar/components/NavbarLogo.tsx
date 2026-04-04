"use client";

import Link from "next/link";
import { useAppSelector } from "@/hooks/redux.hooks";
import Image from "next/image";

export default function NavbarLogo() {
  const locale = useAppSelector((state) => state.language.locale);

  return (
    <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0 group">
      <Image 
        src="/logo.png" 
        alt="Logo" 
        width={180} 
        height={80} 
        className="w-32 h-auto sm:w-[150px] md:w-[180px] object-contain"
        priority
      />
    </Link>
  );
}
