import NavbarIcons from "@/components/common/navbar/components/NavbarIcons";
import NavbarButtons from "@/components/common/navbar/components/NavbarButtons";
import MobileMenu from "@/components/common/navbar/components/MobileMenu";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <NavbarIcons />
      <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />
      <div className="hidden sm:flex">
        <NavbarButtons />
      </div>
      <MobileMenu />
    </div>
  );
}

