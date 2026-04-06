"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface ProductBreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}

export default function ProductBreadcrumb({ breadcrumb }: ProductBreadcrumbProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        {breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {index === breadcrumb.length - 1 ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href} className="flex items-center gap-2">
                  {index === 0 && <Home className="w-4 h-4" />}
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
