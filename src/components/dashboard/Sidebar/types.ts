export interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}
