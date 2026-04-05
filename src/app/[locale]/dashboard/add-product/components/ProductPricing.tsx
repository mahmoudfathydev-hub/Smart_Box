"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductPricing({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // Handle numeric values for Zod
    const numericValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
    dispatch(updateField({ field: name as any, value: numericValue }));
  };

  const hasPriceErrors = !!(errors.price || errors.discount);

  return (
    <Card className={cn(hasPriceErrors && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.price}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price" className={cn(errors.price && "text-destructive")}>
            {dict.price}
          </Label>
          <div className="relative">
            <Input
              id="price"
              name="price"
              type="number"
              value={product.price || ""}
              onChange={handleChange}
              placeholder="0.00"
              className={cn(errors.price && "border-destructive focus-visible:ring-destructive")}
            />
          </div>
          {errors.price && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.price}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discount" className={cn(errors.discount && "text-destructive")}>
            {dict.discount} (%)
          </Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            value={product.discount || ""}
            onChange={handleChange}
            placeholder="0"
            className={cn(errors.discount && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.discount && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.discount}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
