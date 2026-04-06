"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";
import LazyImage from "@/components/common/LazyImage";

interface ProductGalleryProps {
  images: ProductImage[];
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  locale: string;
}

/**
 * Product Gallery Component
 * Apple-style image gallery with thumbnails and zoom
 */
export default function ProductGallery({
  images,
  currentImageIndex,
  onImageChange,
  locale,
}: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentImageIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-600">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LazyImage
          src={currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isZoomed ? "scale(2.5)" : "scale(1)",
            transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : "center",
          }}
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
          {locale === "ar" ? "تكبير" : "Hover to zoom"}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onImageChange(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <LazyImage src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-blue-500/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
