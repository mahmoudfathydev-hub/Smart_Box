import { Review, ReviewRow } from "@/types/review";

/**
 * Review Adapter
 * Transforms Supabase rows to UI Review types
 */
export const reviewAdapter = {
  /**
   * Map database row to UI Review type
   */
  mapReviewRow(row: ReviewRow): Review {
    return {
      id: row.id.toString(),
      productSlug: row.product_slug,
      userId: row.user_id.toString(),
      userName: row.user_name,
      userAvatar: row.user_avatar,
      rating: row.rating,
      comment: row.comment,
      parentId: row.parent_id?.toString(),
      isVerified: row.is_verified,
      likesCount: row.likes_count,
      status: row.status as 'published' | 'pending' | 'rejected',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      language: row.language,
    };
  },

  /**
   * Map multiple rows to Review types
   */
  mapReviewRows(rows: ReviewRow[]): Review[] {
    return rows.map((row) => this.mapReviewRow(row));
  },

  /**
   * Map UI Review to database row (for create/update operations)
   */
  mapReviewToRow(review: Partial<Review>): Partial<ReviewRow> {
    return {
      product_slug: review.productSlug,
      user_id: review.userId ? parseInt(review.userId) : undefined,
      user_name: review.userName,
      user_avatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      parent_id: review.parentId ? parseInt(review.parentId) : undefined,
      is_verified: review.isVerified,
      likes_count: review.likesCount,
      status: review.status,
      language: review.language,
    };
  },
};
