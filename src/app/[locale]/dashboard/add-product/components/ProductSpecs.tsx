"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateSpecs, removeSpec } from "@/redux/modules/addProduct/slice";
import { selectProduct } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProductSpecs({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const [newKey, setNewKey] = useState("");
  const [lang, setLang] = useState<"en" | "ar">("en");

  const addSpec = () => {
    if (newKey) {
      dispatch(updateSpecs({ lang, key: newKey, value: "" }));
      setNewKey("");
    }
  };

  const handleSpecChange = (lang: "en" | "ar", key: string, value: string) => {
    dispatch(updateSpecs({ lang, key, value }));
  };

  const handleDelete = (lang: "en" | "ar", key: string) => {
    dispatch(removeSpec({ lang, key }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{dict.specifications}</CardTitle>
        <div className="flex gap-2">
           <Button variant={lang === "en" ? "default" : "outline"} size="sm" onClick={() => setLang("en")}>EN</Button>
           <Button variant={lang === "ar" ? "default" : "outline"} size="sm" onClick={() => setLang("ar")}>AR</Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Spec Name (e.g. Color)" 
            value={newKey} 
            onChange={(e) => setNewKey(e.target.value)} 
          />
          <Button onClick={addSpec} type="button">
            <Plus className="w-4 h-4 mr-2" /> {dict.add}
          </Button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(lang === "en" ? product.specs_en : product.specs_ar).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-center">
              <Label className="w-1/4 truncate">{key}</Label>
              <Input
                value={value as string}
                onChange={(e) => handleSpecChange(lang, key, e.target.value)}
                placeholder="Value"
                className="flex-1"
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              <Button variant="ghost" size="icon" onClick={() => handleDelete(lang, key)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
