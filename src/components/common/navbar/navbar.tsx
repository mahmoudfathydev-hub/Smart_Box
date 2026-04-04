"use client";

import NavbarContainer from "@/components/common/navbar/components/NavbarContainer";
import NavbarLogo from "@/components/common/navbar/components/NavbarLogo";
import NavbarLinks from "@/components/common/navbar/components/NavbarLinks";
import NavbarActions from "@/components/common/navbar/components/NavbarActions";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <NavbarContainer>
            <NavbarLogo />
            <NavbarLinks />
            <NavbarActions />
          </NavbarContainer>
        </div>
      </div>
    </nav>
  );
}
