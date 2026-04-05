"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { resetForm, setErrors, clearErrors } from "@/redux/modules/addProduct/slice";
import { createProduct } from "@/redux/modules/addProduct/thunks";
import { 
  selectProduct, 
  selectAddProductLoading, 
  selectAddProductSuccess, 
  selectAddProductError,
  selectAddProductErrors
} from "@/redux/modules/addProduct/selectors";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/redux/modules/addProduct/validation";
import { ZodError } from "zod";

export default function SubmitSection({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectAddProductLoading);
  const success = useAppSelector(selectAddProductSuccess);
  const apiError = useAppSelector(selectAddProductError);
  const validationErrors = useAppSelector(selectAddProductErrors);

  const handleSubmit = () => {
    try {
      dispatch(clearErrors());
      
      // Validate using Zod
      productSchema.parse(product);
      
      // If valid, dispatch createProduct
      dispatch(createProduct(product));
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errorMap[issue.path[0] as string] = issue.message;
          }
        });
        dispatch(setErrors(errorMap));
        
        // Scroll to the first error
        const firstErrorKey = Object.keys(errorMap)[0];
        const element = document.getElementById(firstErrorKey);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
    router.back();
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetForm());
        router.push("/dashboard/products");
      }, 2000);
    }
  }, [success, dispatch, router]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="flex flex-col gap-4 mt-8 pb-10">
      {(apiError || hasValidationErrors) && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {apiError ? "Server Error" : "Validation Error"}
            </p>
            <p className="text-xs">
              {apiError || "Please check the form for mistakes and try again."}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20 animate-in fade-in slide-in-from-top-2">
          <div className="bg-green-500 p-1 rounded-full text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Success!</p>
            <p className="text-xs">Product has been created and uploaded successfully.</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button 
          variant="outline" 
          onClick={handleCancel} 
          disabled={loading}
          className="px-8"
        >
          {dict.cancel}
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="px-10 min-w-[140px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            dict.save
          )}
        </Button>
      </div>
    </div>
  );
}
