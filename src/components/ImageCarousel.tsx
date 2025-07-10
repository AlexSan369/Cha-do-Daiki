// Caminho: src/components/ImageCarousel.tsx
"use client";

import React from 'react';
import Image from 'next/image';

// Importando os módulos da Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y, Navigation } from 'swiper/modules';

// Importando os estilos da Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Array com os caminhos das imagens que você preparou
const images = [
  '/images/carrossel-01.jpg',
  '/images/carrossel-02.png',
  '/images/carrossel-01.jpg',
];

const ImageCarousel = () => {
  return (
    <Swiper
      // Instalando os módulos que vamos usar
      modules={[Pagination, Autoplay, A11y, Navigation]}
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      navigation={true} // Habilita os botões de navegação
      pagination={{ clickable: true }} // Habilita os pontinhos de navegação
      autoplay={{
        delay: 10000, // Passa para o próximo slide a cada 4 segundos
        disableOnInteraction: false,
      }}
      className="w-full h-150 rounded-xl"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <Image
            src={src}
            alt={`Imagem ${index + 1} do Chá de Bebê do Daiki`}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
 
export default ImageCarousel;