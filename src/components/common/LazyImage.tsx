import React, { useRef, useEffect, useState } from "react";
import { lazyLoadImage } from "@/lib/utils/cache";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = "/images/placeholder.jpg",
  className = "",
  onLoad,
  onError,
  ...imgProps
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Set initial placeholder
    img.src = placeholder;
    img.classList.add("lazy-image");

    // Setup lazy loading
    lazyLoadImage(img, src);

    // Handle load event
    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    // Handle error event
    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src, placeholder, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? "loaded" : "loading"} ${hasError ? "error" : ""}`}
      {...imgProps}
    />
  );
};

export default LazyImage;
