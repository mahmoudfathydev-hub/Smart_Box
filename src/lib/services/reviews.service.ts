import { ReviewsRepository } from "@/lib/repositories/reviews.repository";
import {
  Review,
  ReviewFormData,
  ReviewSubmissionResponse,
  ProductRatingSummary,
} from "@/types/review";

/**
 * Reviews Service
 * Business logic for review operations
 */
export class ReviewsService {
  /**
   * Get reviews for a product with threaded replies
   */
  static async getProductReviews(
    productSlug: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: "created_at" | "rating" | "likes_count";
      sortOrder?: "asc" | "desc";
      rating?: number;
      language?: string;
    } = {},
  ) {
    const { reviews, pagination } = await ReviewsRepository.getProductReviews(productSlug, params);

    // Fetch replies for each review and build threaded structure
    const reviewsWithReplies = await Promise.all(
      reviews.map(async (review: Review) => {
        if (!review.parentId) {
          const replies = await ReviewsRepository.getReviewReplies(review.id);
          return { ...review, replies };
        }
        return review;
      }),
    );

    // Filter out replies from the main list (they're now nested)
    const mainReviews = reviewsWithReplies.filter((review: Review) => !review.parentId);

    return {
      reviews: mainReviews,
      pagination,
    };
  }

  /**
   * Submit a new review
   */
  static async submitReview(
    productSlug: string,
    formData: ReviewFormData,
    userId?: string,
  ): Promise<ReviewSubmissionResponse> {
    try {
      // Validate form data
      if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
        return {
          success: false,
          message: "Invalid rating. Please provide a rating between 1 and 5.",
        };
      }

      if (!formData.comment || formData.comment.trim().length < 10) {
        return {
          success: false,
          message: "Review comment must be at least 10 characters long.",
        };
      }

      if (!formData.userName || formData.userName.trim().length < 2) {
        return {
          success: false,
          message: "Please provide a valid name.",
        };
      }

      // Create review data
      const reviewData = {
        product_slug: productSlug,
        user_id: userId ? parseInt(userId) : 0, // Guest user if no userId
        user_name: formData.userName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        parent_id: undefined, // Main review, not a reply
        is_verified: false, // Will be updated based on purchase verification
        likes_count: 0,
        status: "pending", // Reviews start as pending for moderation
        language: "en", // Default language, can be updated based on user preference
      };

      const review = await ReviewsRepository.createReview(reviewData);

      return {
        success: true,
        message: "Review submitted successfully! It will be visible after moderation.",
        review,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit review. Please try again.",
      };
    }
  }

  /**
   * Submit a reply to a review
   */
  static async submitReply(
    parentId: string,
    formData: ReviewFormData,
    userId?: string,
  ): Promise<ReviewSubmissionResponse> {
    try {
      // Validate form data
      if (!formData.comment || formData.comment.trim().length < 10) {
        return {
          success: false,
          message: "Reply must be at least 10 characters long.",
        };
      }

      if (!formData.userName || formData.userName.trim().length < 2) {
        return {
          success: false,
          message: "Please provide a valid name.",
        };
      }

      // Get parent review to inherit product slug
      const parentReview = await ReviewsRepository.getReviewById(parentId);
      if (!parentReview) {
        return {
          success: false,
          message: "Parent review not found.",
        };
      }

      // Create reply data
      const replyData = {
        product_slug: parentReview.productSlug,
        user_id: userId ? parseInt(userId) : 0,
        user_name: formData.userName.trim(),
        rating: 0, // Replies don't have ratings
        comment: formData.comment.trim(),
        parent_id: parseInt(parentId),
        is_verified: false,
        likes_count: 0,
        status: "pending",
        language: "en",
      };

      const reply = await ReviewsRepository.createReview(replyData);

      return {
        success: true,
        message: "Reply submitted successfully! It will be visible after moderation.",
        review: reply,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit reply. Please try again.",
      };
    }
  }

  /**
   * Like a review
   */
  static async likeReview(reviewId: string): Promise<Review> {
    return await ReviewsRepository.toggleReviewLike(reviewId);
  }

  /**
   * Get product rating summary
   */
  static async getProductRatingSummary(productSlug: string): Promise<ProductRatingSummary> {
    const [averageData, distribution] = await Promise.all([
      ReviewsRepository.getProductAverageRating(productSlug),
      ReviewsRepository.getProductRatingDistribution(productSlug),
    ]);

    return {
      average: averageData.average,
      count: averageData.count,
      distribution,
    };
  }

  /**
   * Get review statistics for a product
   */
  static async getReviewStats(productSlug: string) {
    const summary = await this.getProductRatingSummary(productSlug);

    return {
      averageRating: summary.average,
      totalReviews: summary.count,
      ratingDistribution: summary.distribution,
      percentageDistribution: summary.distribution.map((item) => ({
        rating: item.rating,
        count: item.count,
        percentage: summary.count > 0 ? (item.count / summary.count) * 100 : 0,
      })),
    };
  }

  /**
   * Update review status (for moderation)
   */
  static async updateReviewStatus(
    reviewId: string,
    status: "published" | "pending" | "rejected",
  ): Promise<Review> {
    return await ReviewsRepository.updateReview(reviewId, { status });
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string): Promise<void> {
    await ReviewsRepository.deleteReview(reviewId);
  }
}
