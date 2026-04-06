'use client';

import { useState } from 'react';
import { Review, ProductRatingSummary } from '@/types/review';
import { Button } from '@/components/ui/button';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import RatingStars from './RatingStars';
import { Star, MessageSquare, ThumbsUp, Filter } from 'lucide-react';

interface ProductReviewsProps {
  productSlug: string;
  initialReviews: Review[];
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  ratingSummary: ProductRatingSummary;
  onReviewsUpdate: (reviews: Review[]) => void;
  locale: string;
}

/**
 * Product Reviews Component
 * Complete reviews section with rating summary, filtering, and threaded reviews
 */
export default function ProductReviews({
  productSlug,
  initialReviews,
  initialPagination,
  ratingSummary,
  onReviewsUpdate,
  locale,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      reviews: { en: 'Reviews', ar: 'المراجعات' },
      writeReview: { en: 'Write a Review', ar: 'اكتب مراجعة' },
      ratingLabel: { en: 'Rating', ar: 'التقييم' },
      verifiedPurchase: { en: 'Verified Purchase', ar: 'شراء موثق' },
      likes: { en: 'Likes', ar: 'إعجابات' },
      replyButton: { en: 'Reply', ar: 'رد' },
      emptyReviews: { en: 'No reviews yet. Be the first to review!', ar: 'لا توجد مراجعات بعد. كن أول من يراجع!' },
      sortBy: { en: 'Sort by:', ar: 'ترتيب حسب:' },
      newest: { en: 'Newest', ar: 'الأحدث' },
      highest: { en: 'Highest Rating', ar: 'الأعلى تقييماً' },
      lowest: { en: 'Lowest Rating', ar: 'الأقل تقييماً' },
      allRatings: { en: 'All Ratings', ar: 'كل التقييمات' },
      star: { en: 'Star', ar: 'نجمة' },
      stars: { en: 'Stars', ar: 'نجوم' },
    };
    return translations[key]?.[locale] || key;
  };

  const handleReviewSubmit = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
    onReviewsUpdate([newReview, ...reviews]);
    setShowReviewForm(false);
  };

  const handleReviewLike = (reviewId: string) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, likesCount: review.likesCount + 1 };
      }
      return review;
    }));
    onReviewsUpdate(reviews);
  };

  const handleReviewReply = (reviewId: string, reply: Review) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: [...(review.replies || []), reply]
        };
      }
      return review;
    }));
    onReviewsUpdate(reviews);
  };

  const getFilteredAndSortedReviews = () => {
    let filteredReviews = reviews;

    // Apply rating filter
    if (filterRating !== null) {
      filteredReviews = filteredReviews.filter(review => review.rating === filterRating);
    }

    // Apply sorting
    return filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {getLocalizedText('reviews')}
            </h2>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {ratingSummary.average.toFixed(1)}
                </div>
                <RatingStars rating={ratingSummary.average} size="md" readonly />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {ratingSummary.count} {getLocalizedText(ratingSummary.count === 1 ? 'star' : 'stars')}
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingSummary.distribution.find(d => d.rating === rating)?.count || 0;
                  const percentage = ratingSummary.count > 0 ? (count / ratingSummary.count) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                        {rating} {getLocalizedText('star')}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {getLocalizedText('writeReview')}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productSlug={productSlug}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
          locale={locale}
        />
      )}

      {/* Reviews Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getLocalizedText('sortBy')}
            </span>
            <div className="flex gap-1">
              {(['newest', 'highest', 'lowest'] as const).map(option => (
                <Button
                  key={option}
                  variant={sortBy === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(option)}
                >
                  {getLocalizedText(option)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <div className="flex gap-1">
            <Button
              variant={filterRating === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(null)}
            >
              {getLocalizedText('allRatings')}
            </Button>
            {[5, 4, 3, 2, 1].map(rating => (
              <Button
                key={rating}
                variant={filterRating === rating ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating(rating)}
              >
                {rating} {getLocalizedText('star')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {getLocalizedText('emptyReviews')}
            </p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              onLike={handleReviewLike}
              onReply={handleReviewReply}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
