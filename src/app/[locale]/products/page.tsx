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
  const { locale } = await params;
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
    categories = [];
    brands = [];

    const categorySet = new Set<string>();
    for (const product of allProducts) {
      const category =
        locale === "ar"
          ? product.category_ar || product.category_en || product.category
          : product.category_en || product.category_ar || product.category;

      if (category) {
        const normalizedCategory = category.trim().toLowerCase();
        if (!categorySet.has(normalizedCategory)) {
          categorySet.add(normalizedCategory);
          categories.push(category);
        }
      }
    }

    const brandSet = new Set<string>();
    for (const product of allProducts) {
      const brand =
        locale === "ar"
          ? product.brand_ar || product.brand_en || product.brand
          : product.brand_en || product.brand_ar || product.brand;

      console.log("Product brand extraction:", {
        productId: product.id,
        brand_en: product.brand_en,
        brand_ar: product.brand_ar,
        brand: product.brand,
        locale: locale,
        selectedBrand: brand,
      });

      if (brand) {
        const normalizedBrand = brand.trim().toLowerCase();
        if (!brandSet.has(normalizedBrand)) {
          brandSet.add(normalizedBrand);
          brands.push(brand);
        }
      }
    }

    console.log("Final brands for locale", locale, ":", brands);

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
