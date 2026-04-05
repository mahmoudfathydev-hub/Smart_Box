"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductBrand({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.brand}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="brand_en">{dict.brand} (EN)</Label>
          <Input
            id="brand_en"
            name="brand_en"
            value={product.brand_en}
            onChange={handleChange}
            placeholder="Brand name in English"
          />
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="brand_ar">{dict.brand} (AR)</Label>
          <Input
            id="brand_ar"
            name="brand_ar"
            value={product.brand_ar}
            onChange={handleChange}
            placeholder="الماركة بالعربية"
            dir="rtl"
          />
        </div>
      </CardContent>
    </Card>
  );
}
