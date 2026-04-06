"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Share2, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  product: Product;
  locale: string;
}

/**
 * Share Buttons Component
 * Social media and link sharing functionality
 */
export default function ShareButtons({ product, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/products/${product.slug}`;
  const productName =
    locale === "ar" && product.name_ar ? product.name_ar : product.name_en || product.name;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${productName}`)}&url=${encodeURIComponent(productUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${productName}: ${productUrl}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-3"
      >
        <Share2 className="w-5 h-5" />
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2">
              {/* Facebook */}
              <button
                onClick={() => handleShare("facebook")}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="w-4 h-4 bg-blue-600 rounded-sm" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="w-4 h-4 bg-sky-500 rounded-sm" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Twitter</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="w-4 h-4 bg-green-500 rounded-sm" />
                <span className="text-sm text-gray-700 dark:text-gray-300">WhatsApp</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Link2 className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {copied
                    ? locale === "ar"
                      ? "تم النسخ!"
                      : "Copied!"
                    : locale === "ar"
                      ? "نسخ الرابط"
                      : "Copy Link"}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
