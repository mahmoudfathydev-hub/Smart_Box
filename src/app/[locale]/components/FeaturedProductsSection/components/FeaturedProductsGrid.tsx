"use client";

import ProductSwiper from "@/components/common/ProductSwiper/ProductSwiper";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";

export default function FeaturedProductsGrid() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  return <ProductSwiper products={dictionary.products} isRTL={isRTL} />;
}
