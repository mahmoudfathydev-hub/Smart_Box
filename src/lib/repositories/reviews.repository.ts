import { supabase } from '@/lib/supabase';
import { Review, ReviewRow, ReviewQueryParams, ReviewsResponse } from '@/types/review';
import { reviewAdapter } from '@/lib/adapters/review.adapter';

/**
 * Reviews Repository
 * Single source of truth for all review data operations
 */
export class ReviewsRepository {
  private static readonly TABLE_NAME = 'Reviews_Section';

  /**
   * Get all reviews for a product with filtering and pagination
   */
  static async getProductReviews(productSlug: string, params: ReviewQueryParams = {}): Promise<ReviewsResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      rating,
      language = 'en',
    } = params;

    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' })
      .eq('product_slug', productSlug)
      .eq('status', 'published')
      .eq('language', language);

    // Apply rating filter
    if (rating !== undefined) {
      query = query.eq('rating', rating);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    const reviews = (data || []).map(reviewAdapter.mapReviewRow);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get single review by ID
   */
  static async getReviewById(id: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch review: ${error.message}`);
    }

    return reviewAdapter.mapReviewRow(data);
  }

  /**
   * Get threaded replies for a review
   */
  static async getReviewReplies(parentId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'published')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch review replies: ${error.message}`);
    }

    return (data || []).map(reviewAdapter.mapReviewRow);
  }

  /**
   * Create new review
   */
  static async createReview(review: Partial<ReviewRow>): Promise<Review> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(review)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return reviewAdapter.mapReviewRow(data);
  }

  /**
   * Update review
   */
  static async updateReview(id: string, updates: Partial<ReviewRow>): Promise<Review> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }

    return reviewAdapter.mapReviewRow(data);
  }

  /**
   * Like/unlike a review
   */
  static async toggleReviewLike(reviewId: string): Promise<Review> {
    const { data: currentReview, error: fetchError } = await supabase
      .from(this.TABLE_NAME)
      .select('likes_count')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch review for like: ${fetchError.message}`);
    }

    const newLikesCount = (currentReview?.likes_count || 0) + 1;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({ likes_count: newLikesCount })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update review likes: ${error.message}`);
    }

    return reviewAdapter.mapReviewRow(data);
  }

  /**
   * Delete review
   */
  static async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }

  /**
   * Get average rating for a product
   */
  static async getProductAverageRating(productSlug: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('rating')
      .eq('product_slug', productSlug)
      .eq('status', 'published');

    if (error) {
      throw new Error(`Failed to fetch product rating: ${error.message}`);
    }

    const reviews = data || [];
    const count = reviews.length;
    const average = count > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / count 
      : 0;

    return { average, count };
  }

  /**
   * Get rating distribution for a product
   */
  static async getProductRatingDistribution(productSlug: string): Promise<{ rating: number; count: number }[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('rating')
      .eq('product_slug', productSlug)
      .eq('status', 'published');

    if (error) {
      throw new Error(`Failed to fetch rating distribution: ${error.message}`);
    }

    const reviews = data || [];
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length
    }));

    return distribution;
  }
}
