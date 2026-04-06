'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review, ProductRatingSummary, ReviewQueryParams } from '@/types/review';
import { ReviewsService } from '@/lib/services/reviews.service';

interface UseProductReviewsOptions {
  productSlug: string;
  initialReviews?: Review[];
  initialPagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  locale?: string;
}

interface UseProductReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  ratingSummary: ProductRatingSummary | null;
  fetchReviews: (params?: ReviewQueryParams) => Promise<void>;
  submitReview: (reviewData: any) => Promise<boolean>;
  submitReply: (parentId: string, replyData: any) => Promise<boolean>;
  likeReview: (reviewId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing product reviews
 * Handles fetching, submitting, and managing review state
 */
export function useProductReviews({
  productSlug,
  initialReviews = [],
  initialPagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  locale = 'en',
}: UseProductReviewsOptions): UseProductReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(initialPagination);
  const [ratingSummary, setRatingSummary] = useState<ProductRatingSummary | null>(null);

  const fetchReviews = useCallback(async (params: ReviewQueryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ReviewsService.getProductReviews(productSlug, {
        page: 1,
        limit: 10,
        language: locale,
        ...params,
      });

      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [productSlug, locale]);

  const fetchRatingSummary = useCallback(async () => {
    try {
      const summary = await ReviewsService.getProductRatingSummary(productSlug);
      setRatingSummary(summary);
    } catch (err) {
      console.error('Failed to fetch rating summary:', err);
    }
  }, [productSlug]);

  const submitReview = useCallback(async (reviewData: any): Promise<boolean> => {
    try {
      const response = await ReviewsService.submitReview(productSlug, reviewData);
      
      if (response.success && response.review) {
        setReviews(prev => [response.review!, ...prev]);
        await fetchRatingSummary(); // Update rating summary
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      return false;
    }
  }, [productSlug, fetchRatingSummary]);

  const submitReply = useCallback(async (parentId: string, replyData: any): Promise<boolean> => {
    try {
      const response = await ReviewsService.submitReply(parentId, replyData);
      
      if (response.success && response.review) {
        setReviews(prev => prev.map(review => {
          if (review.id === parentId) {
            return {
              ...review,
              replies: [...(review.replies || []), response.review!]
            };
          }
          return review;
        }));
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit reply');
      return false;
    }
  }, []);

  const likeReview = useCallback(async (reviewId: string) => {
    try {
      await ReviewsService.likeReview(reviewId);
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          return { ...review, likesCount: review.likesCount + 1 };
        }
        return review;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like review');
    }
  }, []);

  const refetch = useCallback(async () => {
    await Promise.all([
      fetchReviews(),
      fetchRatingSummary(),
    ]);
  }, [fetchReviews, fetchRatingSummary]);

  // Initial fetch
  useEffect(() => {
    if (productSlug) {
      refetch();
    }
  }, [productSlug, refetch]);

  return {
    reviews,
    loading,
    error,
    pagination,
    ratingSummary,
    fetchReviews,
    submitReview,
    submitReply,
    likeReview,
    refetch,
  };
}
