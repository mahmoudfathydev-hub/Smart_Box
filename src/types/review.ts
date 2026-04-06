/**
 * Review Types
 * Compatible with Reviews_Section table structure
 */

export interface Review {
  id: string;
  productSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  parentId?: string;
  isVerified: boolean;
  likesCount: number;
  status: 'published' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  language: string;
  replies?: Review[];
}

/**
 * Supabase Reviews_Section table row type
 */
export interface ReviewRow {
  id: number;
  created_at: string;
  product_slug: string;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  parent_id?: number;
  is_verified: boolean;
  likes_count: number;
  status: string;
  updated_at?: string;
  language: string;
}

/**
 * Review query parameters
 */
export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'rating' | 'likes_count';
  sortOrder?: 'asc' | 'desc';
  rating?: number;
  language?: string;
}

/**
 * Paginated reviews response
 */
export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Review form data
 */
export interface ReviewFormData {
  rating: number;
  comment: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Review submission response
 */
export interface ReviewSubmissionResponse {
  success: boolean;
  message: string;
  review?: Review;
}

/**
 * Product rating summary
 */
export interface ProductRatingSummary {
  average: number;
  count: number;
  distribution: { rating: number; count: number }[];
}
