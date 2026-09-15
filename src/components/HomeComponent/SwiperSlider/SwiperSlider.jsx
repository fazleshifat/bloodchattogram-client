import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectFade, Pagination, Autoplay } from 'swiper/modules';

const slides = [
    '/assets/banner1.jpg',
    '/assets/banner2.png',
    '/assets/banner3.png',
    '/assets/banner4.jpg',
    '/assets/banner5.jpg',
    '/assets/banner6.jpg',
    '/assets/banner7.jpeg',
    '/assets/banner8.png',
    '/assets/banner9.jpg',
    '/assets/banner10.jpg',
    '/assets/banner11.webp',
];

export default function SwiperSlider() {
    return (
        <Swiper
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
            modules={[EffectFade, Pagination, Autoplay]}
            className="w-full aspect-[4/3] rounded-2xl"
        >
            {slides.map((src, i) => (
                <SwiperSlide key={i}>
                    <img
                        src={src}
                        alt={`Blood donation slide ${i + 1}`}
                        className="w-full h-full object-cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
