"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { heroDictionary as enDict } from "@/dict/Home/Hero/en";
import { heroDictionary as arDict } from "@/dict/Home/Hero/ar";
import Image from "next/image";

export default function HeroContent() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-full">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        <ContainerScroll
          titleComponent={
            <div className="w-full flex justify-center px-4">
              <div className="flex flex-col items-center text-center max-w-6xl w-full mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-center">
                  <span className="text-gray-900 dark:text-white">
                    {dictionary.heading.part1}{" "}
                  </span>
                  <span className="text-[#3D9BD6]">
                    {dictionary.heading.part2}
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed mt-8 text-center">
                  {dictionary.description}
                </p>
              </div>
            </div>
          }
        >
          <Image
            src="/portfolio.png"
            alt="Portfolio"
            width={1000}
            height={1000}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
}
