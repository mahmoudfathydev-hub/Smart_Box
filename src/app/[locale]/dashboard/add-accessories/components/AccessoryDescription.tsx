"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addAccessories/slice";
import {
  selectAccessory,
  selectAddAccessoriesErrors,
} from "@/redux/modules/addAccessories/selectors";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccessoryDescription({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const errors = useAppSelector(selectAddAccessoriesErrors);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card
      className={cn((errors.description_en || errors.description_ar) && "border-destructive/50")}
    >
      <CardHeader>
        <CardTitle>{dict.description}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label
            htmlFor="description_en"
            className={cn(errors.description_en && "text-destructive")}
          >
            {dict.descriptionEn}
          </Label>
          <Textarea
            id="description_en"
            name="description_en"
            value={accessory.description_en}
            onChange={handleChange}
            placeholder={dict.descriptionEnPlaceholder}
            className={cn(
              "min-h-[120px]",
              errors.description_en && "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.description_en && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.description_en}
            </p>
          )}
        </div>
        <div className="grid gap-2 text-right">
          <Label
            htmlFor="description_ar"
            className={cn(errors.description_ar && "text-destructive")}
          >
            {dict.descriptionAr}
          </Label>
          <Textarea
            id="description_ar"
            name="description_ar"
            value={accessory.description_ar}
            onChange={handleChange}
            placeholder={dict.descriptionArPlaceholder}
            dir="rtl"
            className={cn(
              "min-h-[120px] text-right",
              errors.description_ar && "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.description_ar && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">
              {errors.description_ar} <AlertCircle className="w-3 h-3" />
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
