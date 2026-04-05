"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addProduct/slice";
import { selectProduct, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoriesDictionary as enCategories } from "@/dict/Home/Categories/en";
import { categoriesDictionary as arCategories } from "@/dict/Home/Categories/ar";

export default function ProductCategory({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const errors = useAppSelector(selectAddProductErrors);

  const handleValueChange = (name: string, value: string) => {
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card className={cn((errors.category_en || errors.category_ar) && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.category}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Category EN */}
        <div className="grid gap-2">
          <Label htmlFor="category_en" className={cn(errors.category_en && "text-destructive")}>
            {dict.category} (EN)
          </Label>
          <Select
            value={product.category_en}
            onValueChange={(value) => handleValueChange("category_en", value)}
          >
            <SelectTrigger 
              id="category_en"
              className={cn(errors.category_en && "border-destructive focus:ring-destructive")}
            >
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {enCategories.categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_en && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95"><AlertCircle className="w-3 h-3"/> {errors.category_en}</p>}
        </div>

        {/* Category AR */}
        <div className="grid gap-2 text-right">
          <Label htmlFor="category_ar" className={cn(errors.category_ar && "text-destructive")}>
            {dict.category} (AR)
          </Label>
          <Select
            value={product.category_ar}
            onValueChange={(value) => handleValueChange("category_ar", value)}
          >
            <SelectTrigger 
              id="category_ar"
              dir="rtl"
              className={cn("text-right", errors.category_ar && "border-destructive focus:ring-destructive")}
            >
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              {arCategories.categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name} className="justify-end text-right">
                  {cat.name} {cat.icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_ar && <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 justify-end animate-in fade-in zoom-in-95">{errors.category_ar} <AlertCircle className="w-3 h-3"/></p>}
        </div>
      </CardContent>
    </Card>
  );
}
