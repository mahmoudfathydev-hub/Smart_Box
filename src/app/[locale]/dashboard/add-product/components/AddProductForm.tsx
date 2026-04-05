"use client";

import ProductIdentity from "./ProductIdentity";
import ProductDescription from "./ProductDescription";
import ProductCategory from "./ProductCategory";
import ProductPricing from "./ProductPricing";
import ProductInventory from "./ProductInventory";
import ProductImages from "./ProductImages";
import ProductSpecs from "./ProductSpecs";
import SubmitSection from "./SubmitSection";
import { Separator } from "@/components/ui/separator";

export default function AddProductForm({ dict }: { dict: any }) {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{dict.title}</h1>
        <p className="text-muted-foreground">{dict.subtitle}</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ProductIdentity dict={dict} />
          <ProductDescription dict={dict} />
          <ProductSpecs dict={dict} />
          <ProductImages dict={dict} />
        </div>

        <div className="flex flex-col gap-8">
          <ProductCategory dict={dict} />
          <ProductPricing dict={dict} />
          <ProductInventory dict={dict} />
        </div>
      </div>

      <Separator />
      <SubmitSection dict={dict} />
    </div>
  );
}
