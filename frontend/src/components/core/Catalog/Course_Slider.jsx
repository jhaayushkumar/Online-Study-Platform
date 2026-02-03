import React, { useEffect, useState } from "react"


// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// import {  Pagination } from "swiper"

import Course_Card from "./Course_Card"



function Course_Slider({ Courses }) {
  // Disable loop to avoid warnings - we have limited courses
  const shouldLoop = false;
  
  // Show skeleton while loading
  if (!Courses || Courses.length === 0) {
    return (
      <div className="flex flex-col sm:flex-row gap-6 ">
        <div className="h-[350px] w-full rounded-xl bg-richblack-700 animate-pulse"></div>
        <div className="h-[350px] w-full rounded-xl bg-richblack-700 animate-pulse hidden lg:flex"></div>
        <div className="h-[350px] w-full rounded-xl bg-richblack-700 animate-pulse hidden lg:flex"></div>
      </div>
    );
  }
  
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={25}
      loop={shouldLoop}
      lazy={{
        loadPrevNext: true,
        loadPrevNextAmount: 2,
      }}
      watchSlidesProgress={true}
      // modules={[ Pagination]}

      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="max-h-[30rem] pt-8 px-2"
    >
      {Courses?.map((course, i) => (
        <SwiperSlide key={course._id || i}>
          <Course_Card course={course} Height={"h-[250px]"} eager={i < 3} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Course_Slider
