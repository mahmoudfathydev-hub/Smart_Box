"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { addProductDictionary as enDict } from "@/dict/Dashboard/Add_Products/en";
import { addProductDictionary as arDict } from "@/dict/Dashboard/Add_Products/ar";
import AddProductForm from "./components/AddProductForm";

export default function AddProductPage() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div className="min-h-screen bg-background p-6">
      <AddProductForm dict={dictionary} />
    </div>
  );
}
