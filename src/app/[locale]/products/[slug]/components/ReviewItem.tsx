'use client';

import { useState } from 'react';
import { Review } from '@/types/review';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';
import { ReviewsService } from '@/lib/services/reviews.service';
import { ThumbsUp, MessageSquare, Check, User, Reply } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
  onLike: (reviewId: string) => void;
  onReply: (reviewId: string, reply: Review) => void;
  locale: string;
}

/**
 * Review Item Component
 * Individual review with threaded replies support
 */
export default function ReviewItem({ review, onLike, onReply, locale }: ReviewItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      verifiedPurchase: { en: 'Verified Purchase', ar: 'شراء موثق' },
      likes: { en: 'Likes', ar: 'إعجابات' },
      replyButton: { en: 'Reply', ar: 'رد' },
      writeReply: { en: 'Write a reply...', ar: 'اكتب رداً...' },
      yourName: { en: 'Your Name', ar: 'اسمك' },
      submitReply: { en: 'Submit Reply', ar: 'إرسال الرد' },
      cancel: { en: 'Cancel', ar: 'إلغاء' },
      replyRequired: { en: 'Reply is required (minimum 10 characters)', ar: 'الرد مطلوب (10 أحرف على الأقل)' },
      nameRequired: { en: 'Name is required', ar: 'الاسم مطلوب' },
    };
    return translations[key]?.[locale] || key;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return locale === 'ar' ? 'أمس' : 'Yesterday';
    } else if (diffDays < 7) {
      return locale === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return locale === 'ar' ? `منذ ${weeks} أسابيع` : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return locale === 'ar' ? `منذ ${months} أشهر` : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return locale === 'ar' ? `منذ ${years} سنوات` : `${years} years ago`;
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await ReviewsService.likeReview(review.id);
      onLike(review.id);
    } catch (error) {
      console.error('Failed to like review:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyName.trim() || replyText.trim().length < 10) {
      return;
    }

    setIsSubmittingReply(true);

    try {
      const response = await ReviewsService.submitReply(review.id, {
        rating: 0,
        comment: replyText.trim(),
        userName: replyName.trim(),
      });

      if (response.success && response.review) {
        onReply(review.id, response.review);
        setReplyText('');
        setReplyName('');
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const isReply = !!review.parentId;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className="space-y-4">
        {/* Review Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {review.userAvatar ? (
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {review.userName}
                </h4>
                {review.isVerified && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Check className="w-3 h-3" />
                    {getLocalizedText('verifiedPurchase')}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
          
          {!isReply && (
            <RatingStars rating={review.rating} size="sm" readonly />
          )}
        </div>

        {/* Review Content */}
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {review.comment}
        </div>

        {/* Review Actions */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ThumbsUp className={`w-4 h-4 mr-1 ${isLiking ? 'animate-pulse' : ''}`} />
            {review.likesCount} {getLocalizedText('likes')}
          </Button>
          
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {getLocalizedText('replyButton')}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && !isReply && (
          <form onSubmit={handleReplySubmit} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  placeholder={getLocalizedText('yourName')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  disabled={isSubmittingReply}
                />
              </div>
              <div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={getLocalizedText('writeReply')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none text-sm"
                  disabled={isSubmittingReply}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingReply || !replyName.trim() || replyText.trim().length < 10}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmittingReply ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Reply className="w-3 h-3 mr-1" />
                      {getLocalizedText('submitReply')}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                    setReplyName('');
                  }}
                  disabled={isSubmittingReply}
                >
                  {getLocalizedText('cancel')}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Replies */}
        {review.replies && review.replies.length > 0 && (
          <div className="space-y-3 mt-4">
            {review.replies.map((reply) => (
              <ReviewItem
                key={reply.id}
                review={reply}
                onLike={onLike}
                onReply={onReply}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
