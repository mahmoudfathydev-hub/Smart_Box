'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

/**
 * Rating Stars Component
 * Interactive or readonly star rating display
 */
export default function RatingStars({
  rating,
  size = 'md',
  readonly = true,
  onRatingChange,
  className = '',
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalfFilled = starValue - 0.5 <= rating && rating < starValue;

    return (
      <button
        key={index}
        onClick={() => handleStarClick(starValue)}
        disabled={readonly}
        className={`${
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
        } transition-transform duration-200`}
      >
        <Star
          className={`${sizeClasses[size]} ${
            isFilled
              ? 'fill-yellow-400 text-yellow-400'
              : isHalfFilled
              ? 'fill-yellow-200 text-yellow-400'
              : 'fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600'
          }`}
        />
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </div>
  );
}
