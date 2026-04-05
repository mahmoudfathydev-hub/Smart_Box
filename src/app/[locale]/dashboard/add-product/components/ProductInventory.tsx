"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductInventory({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? parseInt(value) || 0 : value;
    dispatch(updateField({ field: name as any, value: finalValue }));
  };

  const handleToggle = (checked: boolean) => {
    dispatch(updateField({ field: "is_active", value: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.stock}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3 items-end">
        <div className="grid gap-2">
          <Label htmlFor="stock">{dict.stock}</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sku">{dict.sku}</Label>
          <Input
            id="sku"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            placeholder="SKU-12345"
          />
        </div>
        <div className="flex items-center space-x-2 pb-2">
          <Switch
            id="is_active"
            checked={product.is_active}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="is_active">{dict.active}</Label>
        </div>
      </CardContent>
    </Card>
  );
}
