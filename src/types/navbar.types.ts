import { Routes } from "@/enums/routes.enum";

export interface NavbarLinkItemProps {
  label: string;
  href: string;
}

export interface NavbarDictionary {
  home: string;
  products: string;
  accessories: string;
  compare: string;
  careers: string;
  contact: string;
  login: string;
}

export interface NavbarLink {
  key: keyof Omit<NavbarDictionary, "login">;
  route: Routes;
}
