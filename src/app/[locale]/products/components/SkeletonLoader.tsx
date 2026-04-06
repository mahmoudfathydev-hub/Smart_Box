import { Card, CardContent } from '@/components/ui/card';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ count = 12, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Image Skeleton */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse" />
            </div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-4">
              {/* Category Badge Skeleton */}
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              </div>
              
              {/* Description Skeleton */}
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              </div>
              
              {/* Price and Stock Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12" />
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              
              {/* Button Skeleton */}
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
