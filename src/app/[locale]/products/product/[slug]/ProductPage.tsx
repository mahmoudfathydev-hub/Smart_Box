"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from "@/redux/modules/products/thunks";
import {
  selectProductDetails,
  selectProductDetailsLoading,
  selectProductDetailsError,
  selectRelatedProducts,
  selectRelatedProductsLoading,
  selectRelatedProductsError,
  selectProductBreadcrumb,
} from "@/redux/modules/products/selectors";
import {
  clearProductDetails,
  clearRelatedProducts,
} from "@/redux/modules/products/slice";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductPricing from "./components/ProductPricing";
import ProductActions from "./components/ProductActions";
import ProductSpecs from "./components/ProductSpecs";
import RelatedProducts from "./components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Get slug from params
  const slug = params.slug as string;

  // Redux state
  const product = useAppSelector(selectProductDetails);
  const productLoading = useAppSelector(selectProductDetailsLoading);
  const productError = useAppSelector(selectProductDetailsError);
  const relatedProducts = useAppSelector(selectRelatedProducts);
  const relatedLoading = useAppSelector(selectRelatedProductsLoading);
  const relatedError = useAppSelector(selectRelatedProductsError);
  const breadcrumb = useAppSelector(selectProductBreadcrumb);

  // Local state
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch product and related products on component mount and when slug changes
  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      try {
        // Clear previous data
        dispatch(clearProductDetails());
        dispatch(clearRelatedProducts());

        // Fetch product details
        const productData = await dispatch(fetchProductBySlug(slug)).unwrap();

        // Fetch related products based on product category
        if (productData.categoryId) {
          await dispatch(
            fetchRelatedProducts({
              categoryId: productData.categoryId,
              limit: 8,
            }),
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    };

    fetchProductData();
  }, [dispatch, slug, isInitialLoad]);

  // Handle retry
  const handleRetry = () => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  };

  // Loading skeleton
  if (isInitialLoad && productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-64 mb-4" />
          </div>

          {/* Product Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>

          {/* Specs and Related Products Skeleton */}
          <div className="space-y-12">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productError && !productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {dictionary.error.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {productError || dictionary.error.defaultMessage}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {dictionary.error.retryButton}
              </Button>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product && !productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb breadcrumb={breadcrumb} />

        {/* Product Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Gallery */}
          <div>{product && <ProductGallery images={product.images} />}</div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {product && (
              <>
                <ProductInfo
                  name={product.name}
                  brand={product.brand}
                  rating={product.rating}
                  shortDescription={product.shortDescription}
                  stockQuantity={product.stockQuantity}
                />

                <ProductPricing
                  price={product.price}
                  discountPrice={product.discountPrice}
                  currency={product.currency}
                />

                <ProductActions product={product} />
              </>
            )}
          </div>
        </div>

        {/* Product Specifications */}
        {product && (
          <div className="mb-12">
            <ProductSpecs specs={product.specs} />
          </div>
        )}

        {/* Related Products */}
        <div>
          <RelatedProducts
            products={relatedProducts}
            loading={relatedLoading}
            error={relatedError}
          />
        </div>
      </div>
    </div>
  );
}
