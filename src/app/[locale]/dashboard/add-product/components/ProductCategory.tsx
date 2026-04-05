"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductCategory({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card className={cn((errors.category_en || errors.category_ar) && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.category}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category_en" className={cn(errors.category_en && "text-destructive")}>
            {dict.category} (EN)
          </Label>
          <Select
            id="category_en"
            name="category_en"
            value={product.category_en}
            onChange={handleChange}
            className={cn(errors.category_en && "border-destructive focus:ring-destructive")}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="toys">Toys</option>
          </Select>
          {errors.category_en && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.category_en}</p>}
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="category_ar" className={cn(errors.category_ar && "text-destructive")}>
            {dict.category} (AR)
          </Label>
          <Select
            id="category_ar"
            name="category_ar"
            value={product.category_ar}
            onChange={handleChange}
            dir="rtl"
            className={cn("text-right", errors.category_ar && "border-destructive focus:ring-destructive")}
          >
            <option value="">اختر الفئة</option>
            <option value="electronics">إلكترونيات</option>
            <option value="fashion">موضة</option>
            <option value="home">منزل</option>
            <option value="toys">ألعاب</option>
          </Select>
          {errors.category_ar && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">{errors.category_ar} <AlertCircle className="w-3 h-3"/></p>}
        </div>
      </CardContent>
    </Card>
  );
}
