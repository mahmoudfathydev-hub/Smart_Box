import { ProductRepository } from "@/lib/repositories/product.repository";
import { ProductQueryParams } from "@/types/product";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import ProductsHeader from "./components/ProductsHeader";
import ProductsToolbar from "./components/ProductsToolbar";
import ProductsFilters from "./components/ProductsFilters";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import ProductsPagination from "./components/ProductsPagination";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    availability?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse search params
  const params: ProductQueryParams = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 12,
    search: searchParams.search,
    category: searchParams.category,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    rating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
    availability: searchParams.availability as any,
    tags: searchParams.tags ? searchParams.tags.split(",") : undefined,
    sortBy: searchParams.sortBy as any,
    sortOrder: searchParams.sortOrder as any,
  };

  try {
    // Fetch products server-side
    const productsData = await ProductRepository.getAllProducts(params);
    const products = productsData.products;
    const pagination = productsData.pagination;
    const hasProducts = products.length > 0;
    const totalItems = pagination.totalItems;
    const totalPages = pagination.totalPages;

    // For now, we'll render as a server component with client-side interactivity
    // In a full implementation, you might want to make this a client component
    // for the interactive filtering functionality

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <ProductsHeader
            title="Products"
            subtitle="Discover our wide range of products"
            totalItems={totalItems}
          />

          {/* Toolbar */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search bar would go here - needs client component */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9BD6]"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filters</Button>
                <Button variant="outline">Sort</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - would need client component for interactivity */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Filter functionality requires client-side interactivity
                </p>
              </div>
            </div>

            <div className="flex-1">
              {/* Products Grid */}
              {hasProducts ? (
                <>
                  <ProductsGridClient products={products} totalItems={totalItems} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12">
                      <ProductsPagination
                        currentPage={params.page || 1}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={() => {
                          // Pagination requires client-side navigation
                          console.log("Pagination requires client-side implementation");
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline">Clear filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-12 h-12 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error instanceof Error ? error.message : "Failed to load products"}
            </p>
            <Button className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
