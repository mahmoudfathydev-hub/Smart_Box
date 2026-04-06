"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Review, ProductRatingSummary } from "@/types/review";
import Breadcrumbs from "./Breadcrumbs";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductSpecs from "./ProductSpecs";
import ProductSpecsDisplay from "./ProductSpecsDisplay";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import { Container } from "@/components/ui/container";

interface ProductPageClientProps {
  product: Product;
  initialReviews: Review[];
  reviewsPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  ratingSummary: ProductRatingSummary;
  relatedProducts: Product[];
  locale: string;
}

/**
 * Product Page Client Component
 * Handles all client-side interactivity
 */
export default function ProductPageClient({
  product,
  initialReviews,
  reviewsPagination,
  ratingSummary,
  relatedProducts,
  locale,
}: ProductPageClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<{
    color?: { name: string; hex: string };
    storage?: { label: string; priceModifier: number };
    ram?: { label: string; priceModifier: number };
    [key: string]:
      | { label: string; priceModifier: number }
      | { name: string; hex: string }
      | undefined;
  }>({});

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Calculate dynamic price based on selected variant
  const getDynamicPrice = () => {
    let basePrice = product.price;

    // Add price modifiers for all selected specifications
    Object.entries(selectedVariant).forEach(([key, variant]) => {
      if (variant && "priceModifier" in variant) {
        basePrice += variant.priceModifier;
      }
    });

    return basePrice;
  };

  const dynamicPrice = getDynamicPrice();
  const hasDiscount = Boolean(product.discountPrice && dynamicPrice < product.price);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs product={product} locale={locale} />

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <ProductGallery
            images={product.images}
            currentImageIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
            locale={locale}
          />

          {/* Product Info */}
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            dynamicPrice={dynamicPrice}
            hasDiscount={hasDiscount}
            locale={locale}
          />
        </div>

        {/* Product Description & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {locale === "ar" ? "الوصف" : "Description"}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {locale === "ar" && product.description_ar
                    ? product.description_ar
                    : product.description_en || product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Display */}
        <ProductSpecsDisplay specs={product.specs || []} locale={locale} />

        {/* Reviews Section */}
        <ProductReviews
          productSlug={product.slug}
          initialReviews={reviews}
          initialPagination={reviewsPagination}
          ratingSummary={ratingSummary}
          onReviewsUpdate={setReviews}
          locale={locale}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} locale={locale} />
        )}
      </Container>
    </div>
  );
}
