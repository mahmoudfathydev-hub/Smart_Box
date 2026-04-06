import Link from 'next/link';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { Button } from '@/components/ui/button';

interface NotFoundProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function NotFound({ params }: NotFoundProps) {
  const { locale, slug } = params;

  // Try to get some available products to suggest
  let availableProducts: any[] = [];
  try {
    const result = await ProductRepository.getAllProducts({ limit: 6 });
    availableProducts = result.products;
  } catch (error) {
    console.error('Failed to fetch available products:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {locale === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {locale === 'ar' 
              ? `المنتج برمز "${slug}" غير موجود أو تم إزالته.`
              : `The product with slug "${slug}" was not found or has been removed.`
            }
          </p>
        </div>

        <div className="space-y-4">
          <Link href={`/${locale}/products`}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {locale === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
            </Button>
          </Link>

          {availableProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {locale === 'ar' ? 'منتجات متوفرة' : 'Available Products'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.slug}`}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {locale === 'ar' && product.name_ar 
                        ? product.name_ar 
                        : product.name_en || product.name
                      }
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${product.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
