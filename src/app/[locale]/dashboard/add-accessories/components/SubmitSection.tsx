"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { resetForm, setErrors, clearErrors } from "@/redux/modules/addAccessories/slice";
import { createAccessory } from "@/redux/modules/addAccessories/thunks";
import {
  selectAccessory,
  selectAddAccessoriesLoading,
  selectAddAccessoriesSuccess,
  selectAddAccessoriesError,
  selectAddAccessoriesErrors,
} from "@/redux/modules/addAccessories/selectors";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { accessorySchema } from "@/redux/modules/addAccessories/validation";
import { ZodError } from "zod";

export default function SubmitSection({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const accessory = useAppSelector(selectAccessory);
  const loading = useAppSelector(selectAddAccessoriesLoading);
  const success = useAppSelector(selectAddAccessoriesSuccess);
  const apiError = useAppSelector(selectAddAccessoriesError);
  const validationErrors = useAppSelector(selectAddAccessoriesErrors);

  const handleSubmit = () => {
    try {
      dispatch(clearErrors());

      // Validate using Zod
      accessorySchema.parse(accessory);

      // If valid, dispatch createAccessory
      dispatch(createAccessory(accessory));
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
    router.push("/dashboard/accessories");
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push("/dashboard/accessories");
      }, 2000);
    }
  }, [success, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Error Display */}
      {apiError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">{apiError}</span>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">{dict.success}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
          {dict.cancel}
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading || success}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? dict.saving : dict.save}
        </Button>
      </div>

      {/* Validation Errors Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="text-sm text-muted-foreground">
          Please fix the {Object.keys(validationErrors).length} error(s) above before submitting.
        </div>
      )}
    </div>
  );
}
