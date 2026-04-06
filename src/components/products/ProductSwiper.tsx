"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductSwiperProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favoriteIds?: Set<string>;
  isRTL?: boolean;
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  spaceBetween?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
}

/**
 * Product Swiper Component
 * Uses standardized Product type
 */
export default function ProductSwiper({
  products,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favoriteIds = new Set(),
  isRTL = false,
  slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  spaceBetween = 24,
  autoplay = false,
  autoplayDelay = 3000,
}: ProductSwiperProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Simple custom carousel implementation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const totalSlides = products.length;
  const maxIndex = Math.max(0, totalSlides - (slidesPerView.desktop || 4));

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isAutoplayPaused && totalSlides > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoplayDelay);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, isAutoplayPaused, totalSlides, maxIndex, autoplayDelay]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleMouseEnter = () => {
    setIsAutoplayPaused(true);
  };

  const handleMouseLeave = () => {
    setIsAutoplayPaused(false);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Swiper Container */}
      <div className="overflow-hidden">
        <div
          ref={swiperRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${isRTL ? currentIndex * 100 : -currentIndex * 100}%)`,
            width: `${totalSlides * 100}%`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2"
              style={{
                width: `${100 / (slidesPerView.desktop || 4)}%`,
              }}
            >
              <ProductCard
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoriteIds.has(product.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {totalSlides > (slidesPerView.desktop || 4) && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Previous products"
          >
            <svg
              className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Next products"
          >
            <svg
              className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-[#3D9BD6]" : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
