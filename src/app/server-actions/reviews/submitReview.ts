"use server";

import { revalidatePath } from "next/cache";
import { ReviewsService } from "@/lib/services/reviews.service";
import { validateReviewSubmit } from "@/lib/validation/schemas";

interface ReviewFormData {
  userName: string;
  rating: number;
  comment: string;
}

export async function submitReview(
  productSlug: string,
  reviewData: ReviewFormData,
  userId?: string,
) {
  try {
    // Server-side validation
    const validatedData = validateReviewSubmit(reviewData);

    // Business logic
    const result = await ReviewsService.submitReview(productSlug, validatedData, userId);

    // Revalidate product page
    revalidatePath(`/products/${productSlug}`);

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
}
