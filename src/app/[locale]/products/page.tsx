import { ProductRepository } from "@/lib/repositories/product.repository";
import { Product, ProductsResponse } from "@/types/product";
import { productsDictionary } from "@/dict/Products/en";
import { productsDictionary as productsDictionaryAr } from "@/dict/Products/ar";
import ProductsPageClient from "./components/ProductsPageClient";

interface ProductsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    page?: string;
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    availability?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = params;
  const dict = locale === "ar" ? productsDictionaryAr : productsDictionary;

  // Parse search params
  const parsedParams = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    category: searchParams.category,
    brand: searchParams.brand,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    rating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
    availability: searchParams.availability as "in_stock" | "out_of_stock" | "all",
    sortBy: searchParams.sortBy as "name" | "price" | "rating" | "created_at",
    sortOrder: searchParams.sortOrder as "asc" | "desc",
  };

  // Server-side fetch initial products
  let initialProductsResponse: ProductsResponse;
  let categories: string[] = [];
  let brands: string[] = [];
  let maxPrice = 1000;

  try {
    // Fetch initial products (first 30)
    initialProductsResponse = await ProductRepository.getAllProducts({
      ...parsedParams,
      limit: 30,
      page: 1,
    });

    // Extract unique categories and brands from the response
    const allProducts = initialProductsResponse.products;
    categories = [
      ...new Set(
        allProducts
          .map((p) => p.category_en || p.category_ar || p.category)
          .filter((cat): cat is string => Boolean(cat)),
      ),
    ];

    brands = [
      ...new Set(
        allProducts
          .map((p) => p.brand_en || p.brand_ar || p.brand)
          .filter((brand): brand is string => Boolean(brand)),
      ),
    ];

    // Find max price for slider
    maxPrice = Math.max(...allProducts.map((p) => p.price), 1000);
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
    initialProductsResponse = {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 30,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return (
    <ProductsPageClient
      initialProducts={initialProductsResponse.products}
      initialPagination={initialProductsResponse.pagination}
      categories={categories}
      brands={brands}
      maxPrice={maxPrice}
      initialFilters={parsedParams}
      locale={locale}
      dict={dict}
    />
  );
}
