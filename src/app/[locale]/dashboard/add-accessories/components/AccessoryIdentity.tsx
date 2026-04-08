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

export default function AccessoryIdentity({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const errors = useAppSelector(selectAddAccessoriesErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  const hasNameErrors = !!(errors.name_en || errors.name_ar);
  const hasBrandErrors = !!(errors.brand_en || errors.brand_ar);

  return (
    <Card className={cn((hasNameErrors || hasBrandErrors) && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.accessoryBasicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Name EN/AR */}
        <div className={`grid md:grid-cols-2 gap-4 ${isRTL ? "md:grid-cols-2" : ""}`}>
          <div className="grid gap-2">
            <Label htmlFor="name_en" className={cn(errors.name_en && "text-destructive")}>
              {dict.accessoryName} (EN)
            </Label>
            <Input
              id="name_en"
              name="name_en"
              value={accessory.name_en}
              onChange={handleChange}
              placeholder={dict.nameEnPlaceholder || "e.g. Wireless Headphones"}
              className={cn(errors.name_en && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.name_en && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-3 h-3" /> {errors.name_en}
              </p>
            )}
          </div>
          <div className={`grid gap-2 ${isRTL ? "text-right" : ""}`}>
            <Label htmlFor="name_ar" className={cn(errors.name_ar && "text-destructive")}>
              {dict.accessoryName} (AR)
            </Label>
            <Input
              id="name_ar"
              name="name_ar"
              value={accessory.name_ar}
              onChange={handleChange}
              placeholder={dict.nameArPlaceholder || "مثال: سماعات لاسلكية"}
              dir="rtl"
              className={cn(
                errors.name_ar && "border-destructive focus-visible:ring-destructive text-right",
              )}
            />
            {errors.name_ar && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">
                {errors.name_ar} <AlertCircle className="w-3 h-3" />
              </p>
            )}
          </div>
        </div>

        {/* Brand EN/AR */}
        <div
          className={`grid md:grid-cols-2 gap-4 border-t pt-6 border-muted ${isRTL ? "md:grid-cols-2" : ""}`}
        >
          <div className="grid gap-2">
            <Label htmlFor="brand_en" className={cn(errors.brand_en && "text-destructive")}>
              {dict.brand} (EN)
            </Label>
            <Input
              id="brand_en"
              name="brand_en"
              value={accessory.brand_en}
              onChange={handleChange}
              placeholder={dict.brandEnPlaceholder || "e.g. Sony"}
              className={cn(errors.brand_en && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.brand_en && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-3 h-3" /> {errors.brand_en}
              </p>
            )}
          </div>
          <div className={`grid gap-2 ${isRTL ? "text-right" : ""}`}>
            <Label htmlFor="brand_ar" className={cn(errors.brand_ar && "text-destructive")}>
              {dict.brand} (AR)
            </Label>
            <Input
              id="brand_ar"
              name="brand_ar"
              value={accessory.brand_ar}
              onChange={handleChange}
              placeholder={dict.brandArPlaceholder || "مثال: سوني"}
              dir="rtl"
              className={cn(
                errors.brand_ar && "border-destructive focus-visible:ring-destructive text-right",
              )}
            />
            {errors.brand_ar && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">
                {errors.brand_ar} <AlertCircle className="w-3 h-3" />
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
