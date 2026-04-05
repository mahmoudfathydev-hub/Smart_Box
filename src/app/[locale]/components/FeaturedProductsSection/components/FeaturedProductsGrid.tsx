"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "@/components/common/ProductCard";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { featuredProductsDictionary as enDict } from "@/dict/Home/FeaturedProducts/en";
import { featuredProductsDictionary as arDict } from "@/dict/Home/FeaturedProducts/ar";

import { Swiper as SwiperCore } from "swiper";
SwiperCore.use([Navigation, Pagination]);

export default function FeaturedProductsGrid() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: ".swiper-pagination-custom",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 30,
          },
        }}
        className={`featured-products-swiper ${isRTL ? "rtl-swiper" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {dictionary.products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`swiper-button-next-custom ${isRTL ? "rtl-nav-next" : "ltr-nav-next"}`}
      ></div>
      <div
        className={`swiper-button-prev-custom ${isRTL ? "rtl-nav-prev" : "ltr-nav-prev"}`}
      ></div>
      <div className="swiper-pagination-custom"></div>
    </div>
  );
}
