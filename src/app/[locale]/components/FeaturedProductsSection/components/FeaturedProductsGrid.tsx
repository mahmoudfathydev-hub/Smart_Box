"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductSwiper from "@/components/common/ProductSwiper/ProductSwiper";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";
import { fetchProducts } from "@/redux/modules/addProduct/thunks";
import {
  selectProducts,
  selectFetchingProducts,
} from "@/redux/modules/addProduct/selectors";
import { Product } from "@/redux/modules/addProduct/types";

export default function FeaturedProductsGrid() {
  const dispatch = useDispatch();
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  const products = useSelector(selectProducts);
  const loading = useSelector(selectFetchingProducts);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  // Transform database products to match ProductCard interface
  const transformedProducts = useMemo(() => {
    console.log("FeaturedProductsGrid - Raw products from DB:", products);

    const transformed = products.slice(0, 8).map((product: Product) => {
      console.log(
        `Product ${product.id} - images_url type:`,
        typeof product.images_url,
      );
      console.log(
        `Product ${product.id} - images_url constructor:`,
        product.images_url?.constructor?.name,
      );

      let imageUrl = "";

      // Handle different possible formats of images_url
      if (Array.isArray(product.images_url)) {
        imageUrl = product.images_url[0];
      } else if (typeof product.images_url === "string") {
        try {
          const parsed = JSON.parse(product.images_url);
          if (Array.isArray(parsed) && parsed.length > 0) {
            imageUrl = parsed[0];
          }
        } catch (e) {
          // If it's a JSON string but not parseable, use as is if it looks like a URL
          if (
            product.images_url &&
            (product.images_url as string).startsWith("http")
          ) {
            imageUrl = product.images_url;
          }
        }
      }

      console.log(`Product ${product.id} - Original image URL:`, imageUrl);
      console.log(`Product ${product.id} - All images:`, product.images_url);

      const transformedProduct = {
        id: product.id || "",
        name: locale === Language.AR ? product.name_ar : product.name_en,
        price: product.price * (1 - product.discount / 100), // Apply discount
        originalPrice: product.discount > 0 ? product.price : undefined,
        image: imageUrl, // Let ProductCard handle the fallback
        badge:
          product.discount > 0
            ? `${product.discount}% OFF`
            : product.stock === 0
              ? "Out of Stock"
              : undefined,
        rating: 4.5, // You can add rating field to database later
        description:
          locale === Language.AR
            ? product.description_ar
            : product.description_en,
      };

      console.log(`Product ${product.id} - Transformed:`, transformedProduct);
      return transformedProduct;
    });

    console.log(
      "FeaturedProductsGrid - Final transformed products:",
      transformed,
    );
    return transformed;
  }, [products, locale]);

  const displayProducts = loading
    ? []
    : transformedProducts.length > 0
      ? transformedProducts
      : dictionary.products;

  return <ProductSwiper products={displayProducts} isRTL={isRTL} />;
}
