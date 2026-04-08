"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addAccessories/slice";
import {
  selectAccessory,
  selectAddAccessoriesErrors,
} from "@/redux/modules/addAccessories/selectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const accessoryTypes = [
  "cases",
  "screen_protectors",
  "chargers",
  "cables",
  "adapters",
  "headphones",
  "speakers",
  "power_banks",
  "stands",
  "mounts",
];

export default function AccessoryCategory({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const errors = useAppSelector(selectAddAccessoriesErrors);

  const handleValueChange = (name: string, value: string) => {
    dispatch(updateField({ field: name as any, value }));
  };

  return (
    <Card className={cn(errors.type && "border-destructive/50")}>
      <CardHeader>
        <CardTitle>{dict.type}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Type Selection */}
        <div className="grid gap-2">
          <Label htmlFor="type" className={cn(errors.type && "text-destructive")}>
            {dict.accessoryType}
          </Label>
          <Select
            value={accessory.type}
            onValueChange={(value) => handleValueChange("type", value)}
          >
            <SelectTrigger
              className={cn(errors.type && "border-destructive focus-visible:ring-destructive")}
            >
              <SelectValue placeholder={dict.selectType} />
            </SelectTrigger>
            <SelectContent>
              {accessoryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-3 h-3" /> {errors.type}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
