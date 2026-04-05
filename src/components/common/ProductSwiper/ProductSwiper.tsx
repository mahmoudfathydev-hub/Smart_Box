"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../ProductCard";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface ProductSwiperProps {
  products: any[];
  isRTL?: boolean;
}

export default function ProductSwiper({
  products,
  isRTL = false,
}: ProductSwiperProps) {
  const swiperRef = useRef<any>(null);
  const locale = useAppSelector((state) => state.language.locale);
  const currentIsRTL = locale === Language.AR;

  useEffect(() => {
    // Update Swiper instance when direction changes
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      // Update direction and reinitialize
      swiper.changeDirection(currentIsRTL ? "rtl" : "ltr");

      // Update loop if needed
      if (swiper.params.loop) {
        swiper.loopDestroy();
        swiper.loopCreate();
      }

      // Update navigation elements
      swiper.update();
    }
  }, [currentIsRTL]);

  const handleSwiperInit = (swiper: any) => {
    swiperRef.current = swiper;

    // Ensure initial direction is correct
    if (swiper.params.direction !== (currentIsRTL ? "rtl" : "ltr")) {
      swiper.changeDirection(currentIsRTL ? "rtl" : "ltr");
    }
  };

  return (
    <div className="relative">
      <Swiper
        key={`swiper-${currentIsRTL ? "rtl" : "ltr"}-${products.length}`}
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={true}
        loopAdditionalSlides={2} // Helps with RTL loop stability
        observer={true}
        observeParents={true}
        updateOnWindowResize={true}
        resizeObserver={true}
        a11y={{
          enabled: true,
          prevSlideMessage: currentIsRTL ? "الشريحة التالية" : "Previous slide",
          nextSlideMessage: currentIsRTL ? "الشريحة السابقة" : "Next slide",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
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
        className={`featured-products-swiper ${currentIsRTL ? "rtl-swiper" : ""}`}
        dir={currentIsRTL ? "rtl" : "ltr"}
        onInit={handleSwiperInit}
      >
        {products.map((product, index) => (
          <SwiperSlide key={`${product.id}-${index}`}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`swiper-button-next-custom ${currentIsRTL ? "rtl-nav-next" : "ltr-nav-next"}`}
      ></div>
      <div
        className={`swiper-button-prev-custom ${currentIsRTL ? "rtl-nav-prev" : "ltr-nav-prev"}`}
      ></div>
    </div>
  );
}
