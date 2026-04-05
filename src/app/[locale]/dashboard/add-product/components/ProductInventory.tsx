"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductInventory({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // Handle numeric values for Zod
    const finalValue = type === "number" ? (value === "" ? 0 : parseInt(value, 10)) : value;
    dispatch(updateField({ field: name as any, value: finalValue }));
  };

  const handleToggle = (checked: boolean) => {
    dispatch(updateField({ field: "is_active", value: checked }));
  };

  const hasInventoryErrors = !!(errors.stock || errors.sku);

  return (
    <Card className={cn(hasInventoryErrors && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.stock}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="stock" className={cn(errors.stock && "text-destructive")}>
              {dict.stock}
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={product.stock || ""}
              onChange={handleChange}
              placeholder="0"
              className={cn(errors.stock && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.stock && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.stock}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku" className={cn(errors.sku && "text-destructive")}>
              {dict.sku}
            </Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              placeholder="SKU-12345"
              className={cn(errors.sku && "border-destructive focus-visible:ring-destructive uppercase")}
            />
            {errors.sku && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.sku}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-2 border-t border-muted">
          <Switch
            id="is_active"
            checked={product.is_active}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="is_active" className="cursor-pointer font-medium">{dict.active}</Label>
        </div>
      </CardContent>
    </Card>
  );
}
