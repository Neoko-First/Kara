import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper/modules";

export default function index() {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      allowSlidePrev={false}
      centeredSlides={true}
      slidesPerView={1}
      spaceBetween={0}
      loop={true}
      modules={[EffectCards]}
      className="h-full"
    >
      <SwiperSlide>
        <div className="h-full w-full bg-primary rounded-lg overflow-hidden">
          <img
            alt="test"
            className="h-full w-full object-cover"
            src="https://i.pinimg.com/236x/3e/fa/7a/3efa7a43a5b7876494ee77c3a74489d0.jpg"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="h-full w-full bg-primary rounded-lg overflow-hidden">
          <img
            alt="test"
            className="h-full w-full object-cover"
            src="https://w0.peakpx.com/wallpaper/34/245/HD-wallpaper-silvia-s13-jdm-cars-jdm-jdm-nissan-240sx-thumbnail.jpg"
          />
        </div>
      </SwiperSlide>{" "}
      <SwiperSlide>
        <div className="h-full w-full bg-primary rounded-lg overflow-hidden">
          <img
            alt="test"
            className="h-full w-full object-cover"
            src="https://i.pinimg.com/originals/df/5e/1f/df5e1ffb42541406824cbb2e8c9b4225.jpg"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
