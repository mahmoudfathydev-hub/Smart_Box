// Client-side caching utility for improved performance

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  // Set cache entry
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    };
    
    this.cache.set(key, entry);
    
    // Auto-cleanup after TTL
    setTimeout(() => {
      this.delete(key);
    }, ttl);
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  // Delete cache entry
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get all keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup(): number {
    let cleanedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  // Get cache statistics
  getStats(): {
    size: number;
    entries: Array<{
      key: string;
      age: number;
      ttl: number;
      remainingTTL: number;
    }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl,
      remainingTTL: Math.max(0, entry.ttl - (now - entry.timestamp)),
    }));
    
    return {
      size: this.cache.size,
      entries,
    };
  }
}

// Global cache instance
export const cache = new Cache();

// Specialized cache functions for different data types
export const productCache = {
  // Cache products list
  setProducts: (params: any, data: any, ttl: number = 5 * 60 * 1000) => {
    const key = `products:${JSON.stringify(params)}`;
    cache.set(key, data, ttl);
  },
  
  getProducts: (params: any) => {
    const key = `products:${JSON.stringify(params)}`;
    return cache.get(key);
  },
  
  // Cache single product
  setProduct: (slug: string, data: any, ttl: number = 10 * 60 * 1000) => {
    const key = `product:${slug}`;
    cache.set(key, data, ttl);
  },
  
  getProduct: (slug: string) => {
    const key = `product:${slug}`;
    return cache.get(key);
  },
  
  // Cache related products
  setRelatedProducts: (categoryId: string, data: any, ttl: number = 3 * 60 * 1000) => {
    const key = `related:${categoryId}`;
    cache.set(key, data, ttl);
  },
  
  getRelatedProducts: (categoryId: string) => {
    const key = `related:${categoryId}`;
    return cache.get(key);
  },
  
  // Clear product-related cache
  clearProducts: () => {
    const keys = cache.keys().filter(key => key.startsWith('products:'));
    keys.forEach(key => cache.delete(key));
  },
  
  clearProduct: (slug: string) => {
    const key = `product:${slug}`;
    cache.delete(key);
  },
  
  clearRelatedProducts: (categoryId: string) => {
    const key = `related:${categoryId}`;
    cache.delete(key);
  },
};

// Debounce utility for API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for frequent updates
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization utility for expensive computations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const memo = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (memo.has(key)) {
      return memo.get(key);
    }
    
    const result = func(...args);
    memo.set(key, result);
    return result;
  }) as T;
}

// Image lazy loading helper
export const lazyLoadImage = (imgElement: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );
  
  imgElement.classList.add('lazy');
  observer.observe(imgElement);
};

// Virtual scrolling helper for large lists
export class VirtualScrollManager {
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;
  private totalItems: number;
  
  constructor(itemHeight: number, containerHeight: number, totalItems: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.totalItems = totalItems;
  }
  
  updateScrollTop(scrollTop: number) {
    this.scrollTop = scrollTop;
  }
  
  getVisibleRange() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.totalItems - 1
    );
    
    return { startIndex: Math.max(0, startIndex), endIndex };
  }
  
  getTotalHeight() {
    return this.totalItems * this.itemHeight;
  }
  
  getItemOffset(index: number) {
    return index * this.itemHeight;
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  
  static startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      this.metrics.get(name)!.push(duration);
    };
  }
  
  static getMetrics(name: string) {
    const measurements = this.metrics.get(name) || [];
    
    if (measurements.length === 0) {
      return null;
    }
    
    const sorted = [...measurements].sort((a, b) => a - b);
    const sum = measurements.reduce((a, b) => a + b, 0);
    
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / measurements.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }
  
  static getAllMetrics() {
    const result: Record<string, any> = {};
    
    for (const name of this.metrics.keys()) {
      result[name] = this.getMetrics(name);
    }
    
    return result;
  }
  
  static clearMetrics(name?: string) {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}
