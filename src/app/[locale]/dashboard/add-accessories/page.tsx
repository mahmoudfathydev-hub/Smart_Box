"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { addAccessoriesDictionary as enDict } from "@/dict/Dashboard/Add_Accessories/en";
import { addAccessoriesDictionary as arDict } from "@/dict/Dashboard/Add_Accessories/ar";
import AddAccessoriesForm from "./components/AddAccessoriesForm";

export default function AddAccessoriesPage() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  return (
    <div className={`min-h-screen bg-background p-6 ${isRTL ? "rtl" : "ltr"}`}>
      <AddAccessoriesForm dict={dictionary} isRTL={isRTL} />
    </div>
  );
}
