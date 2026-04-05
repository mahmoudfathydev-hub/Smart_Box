"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCategory({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.category}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category_en">{dict.category} (EN)</Label>
          <Select
            id="category_en"
            name="category_en"
            value={product.category_en}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="toys">Toys</option>
          </Select>
        </div>
        <div className="grid gap-2 text-right">
          <Label htmlFor="category_ar">{dict.category} (AR)</Label>
          <Select
            id="category_ar"
            name="category_ar"
            value={product.category_ar}
            onChange={handleChange}
            dir="rtl"
          >
            <option value="">اختر الفئة</option>
            <option value="إلكترونيات">إلكترونيات</option>
            <option value="موضة">موضة</option>
            <option value="منزل">منزل</option>
            <option value="ألعاب">ألعاب</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
