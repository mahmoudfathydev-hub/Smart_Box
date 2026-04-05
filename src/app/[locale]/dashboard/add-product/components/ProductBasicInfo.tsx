"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ProductBasicInfo({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card className={errors.name_en || errors.name_ar ? "border-destructive" : ""}>
      <CardHeader>
        <CardTitle>{dict.productBasicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name_en" className={errors.name_en ? "text-destructive" : ""}>
            {dict.productName} (EN)
          </Label>
          <Input
            id="name_en"
            name="name_en"
            value={product.name_en}
            onChange={handleChange}
            placeholder="Product name in English"
            className={errors.name_en ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.name_en && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name_en}</p>}
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="name_ar" className={errors.name_ar ? "text-destructive" : ""}>
            {dict.productName} (AR)
          </Label>
          <Input
            id="name_ar"
            name="name_ar"
            value={product.name_ar}
            onChange={handleChange}
            placeholder="اسم المنتج بالعربية"
            dir="rtl"
            className={errors.name_ar ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.name_ar && <p className="text-xs text-destructive flex items-center gap-1 justify-end">{errors.name_ar} <AlertCircle className="w-3 h-3"/></p>}
        </div>
      </CardContent>
    </Card>
  );
}
