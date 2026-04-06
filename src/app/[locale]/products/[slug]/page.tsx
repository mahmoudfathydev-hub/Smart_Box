import { notFound } from "next/navigation";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { ReviewsService } from "@/lib/services/reviews.service";
import ProductPageClient from "./components/ProductPageClient";
import { Product } from "@/types/product";
import { Review, ProductRatingSummary } from "@/types/review";

interface ProductPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

/**
 * Product Page Server Component
 * Fetches initial data and renders client component
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;

  try {
    console.log(`[DEBUG] Loading product page for slug: ${slug}`);

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[DEBUG] Missing Supabase environment variables");
      throw new Error("Database configuration missing");
    }

    // Fetch product data using repository pattern
    const product = await ProductRepository.getProductBySlug(slug);
    console.log(`[DEBUG] Product found:`, product?.id || "null");

    if (!product) {
      console.log(`[DEBUG] Product not found for slug: ${slug}`);

      // Try to get available products for debugging
      try {
        const allProducts = await ProductRepository.getAllProducts({ limit: 5 });
        console.log(
          `[DEBUG] Available products:`,
          allProducts.products.map((p) => ({ id: p.id, slug: p.slug, name: p.name })),
        );
      } catch (productsError) {
        console.error("[DEBUG] Error fetching all products:", productsError);
      }

      notFound();
    }

    // Fetch reviews data using service layer (with error handling)
    let reviewsData = {
      reviews: [] as Review[],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    try {
      reviewsData = await ReviewsService.getProductReviews(slug, {
        page: 1,
        limit: 10,
        language: locale,
      });
      console.log(`[DEBUG] Reviews loaded: ${reviewsData.reviews.length} reviews`);
    } catch (reviewError) {
      console.error("[DEBUG] Error loading reviews:", reviewError);
      // Continue without reviews if they fail to load
    }

    // Fetch rating summary (with error handling)
    let ratingSummary: ProductRatingSummary = { average: 0, count: 0, distribution: [] };
    try {
      ratingSummary = await ReviewsService.getProductRatingSummary(slug);
      console.log(`[DEBUG] Rating summary loaded:`, ratingSummary);
    } catch (ratingError) {
      console.error("[DEBUG] Error loading rating summary:", ratingError);
      // Continue without rating if it fails to load
    }

    // Fetch related products (with error handling)
    let relatedProducts: Product[] = [];
    try {
      relatedProducts = await ProductRepository.getRelatedProducts(
        product.category_en || product.category || "",
        slug,
        8,
      );
      console.log(`[DEBUG] Related products loaded: ${relatedProducts.length} products`);
    } catch (relatedError) {
      console.error("[DEBUG] Error loading related products:", relatedError);
      // Continue without related products if they fail to load
    }

    console.log(`[DEBUG] All data loaded successfully for product: ${product.id}`);

    return (
      <ProductPageClient
        product={product}
        initialReviews={reviewsData.reviews}
        reviewsPagination={reviewsData.pagination}
        ratingSummary={ratingSummary}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    );
  } catch (error) {
    console.error("[DEBUG] Critical error loading product page:", error);

    // In development, show more detailed error info
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Development Error</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Failed to load product page for slug: {slug}
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {error instanceof Error ? error.stack : "No stack trace"}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Debugging steps:</strong>
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Check if Supabase environment variables are set</li>
                <li>Verify database connection</li>
                <li>Check if products exist in Add_Products table</li>
                <li>
                  Visit <code>/api/test/product</code> to test repository
                </li>
                <li>
                  Visit <code>/api/debug/products</code> to see available products
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    notFound();
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug, locale } = await params;

  try {
    const product = await ProductRepository.getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const productName =
      locale === "ar" && product.name_ar ? product.name_ar : product.name_en || product.name;
    const description =
      locale === "ar" && product.description_ar
        ? product.description_ar
        : product.description_en || product.description;

    return {
      title: `${productName} | SmartBox`,
      description: description?.substring(0, 160) || `Shop ${productName} at SmartBox`,
      openGraph: {
        title: productName,
        description: description?.substring(0, 160),
        images: product.images?.[0] ? [product.images[0].url] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: productName,
        description: description?.substring(0, 160),
        images: product.images?.[0] ? [product.images[0].url] : [],
      },
      alternates: {
        canonical: `/products/${slug}`,
        languages: {
          en: `/en/products/${slug}`,
          ar: `/ar/products/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | SmartBox",
      description: "Product details at SmartBox",
    };
  }
}
