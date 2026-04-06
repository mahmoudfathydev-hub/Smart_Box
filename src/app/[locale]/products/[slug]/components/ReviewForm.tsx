'use client';

import { useState } from 'react';
import { ReviewFormData } from '@/types/review';
import { Button } from '@/components/ui/button';
import { ReviewsService } from '@/lib/services/reviews.service';
import RatingStars from './RatingStars';
import { X, Star, User, Mail, MessageSquare } from 'lucide-react';

interface ReviewFormProps {
  productSlug: string;
  onSubmit: (review: any) => void;
  onCancel: () => void;
  locale: string;
}

/**
 * Review Form Component
 * Form for submitting new product reviews
 */
export default function ReviewForm({ productSlug, onSubmit, onCancel, locale }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    userName: '',
    userEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      writeReview: { en: 'Write a Review', ar: 'اكتب مراجعة' },
      yourRating: { en: 'Your Rating', ar: 'تقييمك' },
      yourName: { en: 'Your Name', ar: 'اسمك' },
      yourEmail: { en: 'Your Email', ar: 'بريدك الإلكتروني' },
      yourReview: { en: 'Your Review', ar: 'مراجعتك' },
      submit: { en: 'Submit Review', ar: 'إرسال المراجعة' },
      cancel: { en: 'Cancel', ar: 'إلغاء' },
      nameRequired: { en: 'Name is required', ar: 'الاسم مطلوب' },
      emailRequired: { en: 'Email is required', ar: 'البريد الإلكتروني مطلوب' },
      emailInvalid: { en: 'Invalid email address', ar: 'بريد إلكتروني غير صالح' },
      ratingRequired: { en: 'Please select a rating', ar: 'يرجى اختيار تقييم' },
      reviewRequired: { en: 'Review is required (minimum 10 characters)', ar: 'المراجعة مطلوبة (10 أحرف على الأقل)' },
      reviewMinLength: { en: 'Review must be at least 10 characters long', ar: 'يجب أن تكون المراجعة 10 أحرف على الأقل' },
      reviewMaxLength: { en: 'Review must be less than 1000 characters', ar: 'يجب أن تكون المراجعة أقل من 1000 حرف' },
    };
    return translations[key]?.[locale] || key;
  };

  const validateForm = (): string | null => {
    if (!formData.userName || formData.userName.trim().length < 2) {
      return getLocalizedText('nameRequired');
    }

    if (!formData.userEmail) {
      return getLocalizedText('emailRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      return getLocalizedText('emailInvalid');
    }

    if (formData.rating === 0) {
      return getLocalizedText('ratingRequired');
    }

    if (!formData.comment || formData.comment.trim().length < 10) {
      return getLocalizedText('reviewMinLength');
    }

    if (formData.comment.length > 1000) {
      return getLocalizedText('reviewMaxLength');
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await ReviewsService.submitReview(productSlug, formData);
      
      if (response.success) {
        onSubmit(response.review);
        // Reset form
        setFormData({
          rating: 0,
          comment: '',
          userName: '',
          userEmail: '',
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {getLocalizedText('writeReview')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {getLocalizedText('yourRating')} *
          </label>
          <RatingStars
            rating={formData.rating}
            size="lg"
            readonly={false}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            {getLocalizedText('yourName')} *
          </label>
          <input
            type="text"
            id="userName"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={getLocalizedText('yourName')}
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            {getLocalizedText('yourEmail')} *
          </label>
          <input
            type="email"
            id="userEmail"
            value={formData.userEmail}
            onChange={(e) => handleInputChange('userEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={getLocalizedText('yourEmail')}
            disabled={isSubmitting}
          />
        </div>

        {/* Review */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {getLocalizedText('yourReview')} *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder={getLocalizedText('yourReview')}
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.comment.length}/1000
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {locale === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                {getLocalizedText('submit')}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {getLocalizedText('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
