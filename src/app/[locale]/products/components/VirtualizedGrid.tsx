import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

interface VirtualizedGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favoriteIds?: Set<string>;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  itemHeight?: number;
  gap?: number;
}

export default function VirtualizedGrid({
  products,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favoriteIds = new Set(),
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 3, // Changed from 4 to 3
  },
  itemHeight = 500,
  gap = 16,
}: VirtualizedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight || 600);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { columnCount, columnWidth } = useMemo(() => {
    let cols = columns.mobile || 1;

    if (containerWidth >= 1280) {
      cols = columns.large || 3;
    } else if (containerWidth >= 1024) {
      cols = columns.desktop || 3;
    } else if (containerWidth >= 768) {
      cols = columns.tablet || 2;
    }

    const totalGap = gap * (cols - 1);
    const width = (containerWidth - totalGap) / cols;

    return {
      columnCount: cols,
      columnWidth: Math.max(width, 200), // Minimum width
    };
  }, [containerWidth, columns, gap]);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / (itemHeight + gap)) * columnCount;
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / (itemHeight + gap)) * columnCount + columnCount * 2,
      products.length,
    );

    return products.slice(startIndex, endIndex).map((product, index) => ({
      product,
      index: startIndex + index,
      row: Math.floor((startIndex + index) / columnCount),
      col: (startIndex + index) % columnCount,
    }));
  }, [products, scrollTop, containerHeight, itemHeight, gap, columnCount]);

  const totalHeight = Math.ceil(products.length / columnCount) * (itemHeight + gap);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">No products to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map(({ product, index, row, col }) => (
          <div
            key={product.id}
            style={{
              position: "absolute",
              top: row * (itemHeight + gap),
              left: col * (columnWidth + gap),
              width: columnWidth,
              height: itemHeight,
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
  );
}
