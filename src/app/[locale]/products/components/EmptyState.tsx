import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary } from "@/dict/Products/en";
import { productsDictionary as productsDictionaryAr } from "@/dict/Products/ar";

interface EmptyStateProps {
  type: "no-results" | "error" | "no-products";
  message?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  className?: string;
}

export default function EmptyState({
  type,
  message,
  onRetry,
  onClearFilters,
  className = "",
}: EmptyStateProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;
  const dict = locale === Language.AR ? productsDictionaryAr : productsDictionary;

  const getIcon = () => {
    switch (type) {
      case "no-results":
        return <Search className="w-16 h-16 text-gray-400" />;
      case "error":
        return <RefreshCw className="w-16 h-16 text-red-400" />;
      case "no-products":
        return <Package className="w-16 h-16 text-gray-400" />;
      default:
        return <Package className="w-16 h-16 text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "no-results":
        return dict.empty.title;
      case "error":
        return dict.error.title;
      case "no-products":
        return dict.empty.title;
      default:
        return dict.empty.title;
    }
  };

  const getDescription = () => {
    if (message) return message;

    switch (type) {
      case "no-results":
        return dict.empty.message;
      case "error":
        return dict.error.defaultMessage;
      case "no-products":
        return dict.empty.message;
      default:
        return dict.empty.message;
    }
  };

  const getActions = () => {
    switch (type) {
      case "no-results":
        return (
          <>
            {onClearFilters && (
              <Button onClick={onClearFilters} variant="outline">
                {dict.empty.clearFilters}
              </Button>
            )}
          </>
        );
      case "error":
        return (
          <>
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {dict.error.retryButton}
              </Button>
            )}
          </>
        );
      case "no-products":
        return (
          <>
            {onClearFilters && (
              <Button onClick={onClearFilters} variant="outline">
                {dict.empty.clearFilters}
              </Button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className} ${isRTL ? "rtl" : ""}`}
    >
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-6">{getIcon()}</div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{getTitle()}</h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {getDescription()}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">{getActions()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
