import NavbarIcons from "@/components/common/navbar/components/NavbarIcons";
import NavbarButtons from "@/components/common/navbar/components/NavbarButtons";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-3">
      <NavbarIcons />
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
      <NavbarButtons />
    </div>
  );
}

