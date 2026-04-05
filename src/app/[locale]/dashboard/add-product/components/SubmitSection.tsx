"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { resetForm } from "@/redux/modules/addProduct/slice";
import { createProduct } from "@/redux/modules/addProduct/thunks";
import { selectProduct, selectAddProductLoading, selectAddProductSuccess, selectAddProductError } from "@/redux/modules/addProduct/selectors";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubmitSection({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const product = useAppSelector(selectProduct) as any;
  const loading = useAppSelector(selectAddProductLoading) as boolean;
  const success = useAppSelector(selectAddProductSuccess) as boolean;
  const error = useAppSelector(selectAddProductError) as string | null;

  const handleSubmit = () => {
    if (!product.name_en || !product.name_ar || !product.price || !product.category_en) {
      alert("Please fill in all required fields (Name EN/AR, Price, Category)");
      return;
    }
    dispatch(createProduct(product));
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

  return (
    <div className="flex flex-col gap-4 mt-8">
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
      {success && <p className="text-green-600 text-sm font-medium">Product added successfully!</p>}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleCancel} disabled={loading}>
          {dict.cancel}
        </Button>
        <Button onClick={handleSubmit} disabled={loading || product.name_en === ""}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {dict.save}
        </Button>
      </div>
    </div>
  );
}
