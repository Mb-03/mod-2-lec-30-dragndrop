"use client";

import Image, { StaticImageData } from "next/image";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface BasicSwiperProps {
  images: StaticImageData[];
}

const BasicSwiper = ({ images }: BasicSwiperProps) => {
  return (
    <div className="relative w-full">
      <Swiper
        className="w-full h-96 rounded-xl"
        spaceBetween={20}
        slidesPerView={1}
        loop={images.length > 0}
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
      >
        {images.map((imgSrc, idx) => (
          <SwiperSlide
            key={idx}
            className="flex items-center justify-center border bg-[#123318] border-[#2a2b30] rounded-xl overflow-hidden"
          >
            <div className="w-full h-full relative">
              <Image
                src={imgSrc}
                alt={`slide-${idx}`}
                fill
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: var(--text-gold);
          background: var(--card-bg);
          border: 1px solid var(--border);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: var(--green-light);
          color: white;
          transform: scale(1.1);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .swiper-pagination-bullet {
          background: var(--text-secondary);
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          background: var(--green-light);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default BasicSwiper;
