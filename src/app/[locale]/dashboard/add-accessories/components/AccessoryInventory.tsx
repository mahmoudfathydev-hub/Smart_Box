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
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccessoryInventory({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const errors = useAppSelector(selectAddAccessoriesErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === "stock_quantity" ? parseInt(value) || 0 : value;
    dispatch(updateField({ field: name as any, value: numValue }));
  };

  const handleSwitchChange = (checked: boolean) => {
    dispatch(updateField({ field: "is_active", value: checked }));
  };

  return (
    <Card className={cn(errors.stock_quantity && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.stock}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Stock Quantity */}
        <div className="grid gap-2">
          <Label
            htmlFor="stock_quantity"
            className={cn(errors.stock_quantity && "text-destructive")}
          >
            {dict.stock}
          </Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            value={accessory.stock_quantity}
            onChange={handleChange}
            placeholder={dict.stockPlaceholder}
            className={cn(
              errors.stock_quantity && "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.stock_quantity && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.stock_quantity}
            </p>
          )}
        </div>

        {/* SKU */}
        <div className="grid gap-2 border-t pt-6 border-muted">
          <Label htmlFor="sku" className={cn(errors.sku && "text-destructive")}>
            {dict.sku}
          </Label>
          <Input
            id="sku"
            name="sku"
            value={accessory.sku}
            onChange={handleChange}
            placeholder={dict.skuPlaceholder}
            className={cn(errors.sku && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.sku && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.sku}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div className="grid gap-2 border-t pt-6 border-muted">
          <div
            className="flex items-center justify-between"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {isRTL ? (
              <>
                <Switch
                  id="is_active"
                  checked={accessory.is_active}
                  onCheckedChange={handleSwitchChange}
                  isRTL={isRTL}
                />
                <Label htmlFor="is_active" className="ml-3">
                  {dict.active}
                </Label>
              </>
            ) : (
              <>
                <Label htmlFor="is_active">{dict.active}</Label>
                <Switch
                  id="is_active"
                  checked={accessory.is_active}
                  onCheckedChange={handleSwitchChange}
                  isRTL={isRTL}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
