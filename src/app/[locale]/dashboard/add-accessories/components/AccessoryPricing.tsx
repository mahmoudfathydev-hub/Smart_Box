"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addAccessories/slice";
import {
  selectAccessory,
  selectAddAccessoriesErrors,
} from "@/redux/modules/addAccessories/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccessoryPricing({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const errors = useAppSelector(selectAddAccessoriesErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === "price" || name === "discount" ? parseFloat(value) || 0 : value;
    dispatch(updateField({ field: name as any, value: numValue }));
  };

  return (
    <Card className={cn((errors.price || errors.discount) && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.price}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Price */}
        <div className="grid gap-2">
          <Label htmlFor="price" className={cn(errors.price && "text-destructive")}>
            {dict.price}
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={accessory.price}
            onChange={handleChange}
            placeholder={dict.pricePlaceholder}
            className={cn(errors.price && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.price && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.price}
            </p>
          )}
        </div>

        {/* Discount */}
        <div className="grid gap-2 border-t pt-6 border-muted">
          <Label htmlFor="discount" className={cn(errors.discount && "text-destructive")}>
            {dict.discount} (%)
          </Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={accessory.discount}
            onChange={handleChange}
            placeholder={dict.discountPlaceholder}
            className={cn(errors.discount && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.discount && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.discount}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
