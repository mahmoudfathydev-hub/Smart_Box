"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductBasicInfo({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.productBasicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name_en">{dict.productName} (EN)</Label>
          <Input
            id="name_en"
            name="name_en"
            value={product.name_en}
            onChange={handleChange}
            placeholder="Product name in English"
          />
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="name_ar">{dict.productName} (AR)</Label>
          <Input
            id="name_ar"
            name="name_ar"
            value={product.name_ar}
            onChange={handleChange}
            placeholder="اسم المنتج بالعربية"
            dir="rtl"
          />
        </div>
      </CardContent>
    </Card>
  );
}
