"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { sidebarDictionary as enDict } from "@/dict/Dashboard/common/en";
import { sidebarDictionary as arDict } from "@/dict/Dashboard/common/ar";
import {
  BarChart3,
  Package,
  Plus,
  Package2,
  Users,
  UserCheck,
} from "lucide-react";
import SidebarLink from "./SidebarLink";

interface MainNavigationProps {
  isCollapsed?: boolean;
}

export default function MainNavigation({ isCollapsed }: MainNavigationProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  const navigationLinks = [
    {
      href: "/dashboard/analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      label: dictionary.analytics,
    },
    {
      href: "/dashboard/products",
      icon: <Package className="w-6 h-6" />,
      label: dictionary.products,
    },
    {
      href: "/dashboard/add-product",
      icon: <Plus className="w-6 h-6" />,
      label: dictionary.addProduct,
    },
    {
      href: "/dashboard/add-accessories",
      icon: <Plus className="w-6 h-6" />,
      label: dictionary.addAccessories,
    },
    {
      href: "/dashboard/inventory",
      icon: <Package2 className="w-6 h-6" />,
      label: dictionary.inventory,
    },
    {
      href: "/dashboard/users",
      icon: <Users className="w-6 h-6" />,
      label: dictionary.users,
    },
    {
      href: "/dashboard/employees",
      icon: <UserCheck className="w-6 h-6" />,
      label: dictionary.employees,
    },
  ];

  return (
    <nav className="space-y-1">
      {navigationLinks.map((link) => (
        <SidebarLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          label={link.label}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}
