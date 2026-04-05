"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDescription({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.description}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="description_en">{dict.description} (EN)</Label>
          <Textarea
            id="description_en"
            name="description_en"
            value={product.description_en}
            onChange={handleChange}
            placeholder="Product description in English"
            rows={4}
          />
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="description_ar">{dict.description} (AR)</Label>
          <Textarea
            id="description_ar"
            name="description_ar"
            value={product.description_ar}
            onChange={handleChange}
            placeholder="وصف المنتج بالعربية"
            dir="rtl"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
