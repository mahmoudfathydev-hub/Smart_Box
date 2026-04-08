"use client";

import AccessoryIdentity from "./AccessoryIdentity";
import AccessoryDescription from "./AccessoryDescription";
import AccessoryCategory from "./AccessoryCategory";
import AccessoryPricing from "./AccessoryPricing";
import AccessoryInventory from "./AccessoryInventory";
import AccessoryImages from "./AccessoryImages";
import AccessorySpecs from "./AccessorySpecs";
import SubmitSection from "./SubmitSection";
import { Separator } from "@/components/ui/separator";

export default function AddAccessoriesForm({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{dict.title}</h1>
        <p className="text-muted-foreground">{dict.subtitle}</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AccessoryIdentity dict={dict} isRTL={isRTL} />
          <AccessoryDescription dict={dict} isRTL={isRTL} />
          <AccessorySpecs dict={dict} isRTL={isRTL} />
          <AccessoryImages dict={dict} isRTL={isRTL} />
        </div>

        <div className="flex flex-col gap-8">
          <AccessoryCategory dict={dict} isRTL={isRTL} />
          <AccessoryPricing dict={dict} isRTL={isRTL} />
          <AccessoryInventory dict={dict} isRTL={isRTL} />
        </div>
      </div>

      <Separator />
      <SubmitSection dict={dict} isRTL={isRTL} />
    </div>
  );
}
