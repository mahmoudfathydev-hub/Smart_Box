import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VirtualScrollManager } from '@/lib/utils/cache';

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

function VirtualizedGrid<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  // Create virtual scroll manager
  const virtualManager = useMemo(
    () => new VirtualScrollManager(itemHeight, containerHeight, items.length),
    [itemHeight, containerHeight, items.length]
  );
  
  // Update scroll position
  useEffect(() => {
    virtualManager.updateScrollTop(scrollTop);
  }, [scrollTop, virtualManager]);
  
  // Calculate visible range
  const visibleRange = useMemo(() => {
    const range = virtualManager.getVisibleRange();
    return {
      startIndex: Math.max(0, range.startIndex - overscan),
      endIndex: Math.min(items.length - 1, range.endIndex + overscan),
    };
  }, [virtualManager, items.length, overscan]);
  
  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  };
  
  // Render visible items
  const visibleItems = useMemo(() => {
    const itemsToRender = [];
    
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      const item = items[i];
      if (item) {
        const style = {
          position: 'absolute' as const,
          top: virtualManager.getItemOffset(i),
          left: 0,
          right: 0,
          height: itemHeight,
        };
        
        itemsToRender.push(
          <div key={i} style={style}>
            {renderItem(item, i, style)}
          </div>
        );
      }
    }
    
    return itemsToRender;
  }, [visibleRange, items, virtualManager, itemHeight, renderItem]);
  
  return (
    <div
      ref={scrollElementRef}
      className={`virtualized-grid ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: virtualManager.getTotalHeight(),
          position: 'relative',
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

export default VirtualizedGrid;
