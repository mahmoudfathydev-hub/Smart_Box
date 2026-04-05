"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductPricing({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const numericValue = type === "number" ? parseFloat(value) || 0 : value;
    dispatch(updateField({ field: name as any, value: numericValue }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.price}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">{dict.price}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discount">{dict.discount} (%)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            value={product.discount}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
