'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  product: Product;
  locale: string;
}

/**
 * Breadcrumbs Component
 * Navigation breadcrumb trail for product pages
 */
export default function Breadcrumbs({ product, locale }: BreadcrumbsProps) {
  const isRTL = locale === 'ar';

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      home: { en: 'Home', ar: 'الرئيسية' },
      products: { en: 'Products', ar: 'المنتجات' },
    };
    return translations[key]?.[locale] || key;
  };

  const getCategoryName = () => {
    return locale === 'ar' && product.category_ar 
      ? product.category_ar 
      : product.category_en || product.category || 'Products';
  };

  const breadcrumbs = [
    {
      label: getLocalizedText('home'),
      href: '/',
      icon: Home,
    },
    {
      label: getLocalizedText('products'),
      href: '/products',
    },
    {
      label: getCategoryName(),
      href: `/products?category=${encodeURIComponent(product.category_en || product.category || '')}`,
    },
    {
      label: locale === 'ar' && product.name_ar 
        ? product.name_ar 
        : product.name_en || product.name,
      href: `/products/${product.slug}`,
      current: true,
    },
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight 
              className={`w-4 h-4 mx-2 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} 
            />
          )}
          
          {breadcrumb.current ? (
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors truncate max-w-xs"
            >
              {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4 mr-1 flex-shrink-0" />}
              <span>{breadcrumb.label}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
