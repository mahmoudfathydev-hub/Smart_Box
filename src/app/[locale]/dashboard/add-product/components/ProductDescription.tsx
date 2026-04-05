"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDescription({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card className={cn((errors.description_en || errors.description_ar) && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.description}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="description_en" className={cn(errors.description_en && "text-destructive")}>
            {dict.description} (EN)
          </Label>
          <Textarea
            id="description_en"
            name="description_en"
            value={product.description_en}
            onChange={handleChange}
            placeholder="Detailed product description in English"
            className={cn("min-h-[120px]", errors.description_en && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.description_en && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.description_en}</p>}
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="description_ar" className={cn(errors.description_ar && "text-destructive")}>
            {dict.description} (AR)
          </Label>
          <Textarea
            id="description_ar"
            name="description_ar"
            value={product.description_ar}
            onChange={handleChange}
            placeholder="وصف المنتج التفصيلي بالعربية"
            dir="rtl"
            className={cn("min-h-[120px] text-right", errors.description_ar && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.description_ar && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">{errors.description_ar} <AlertCircle className="w-3 h-3"/></p>}
        </div>
      </CardContent>
    </Card>
  );
}
