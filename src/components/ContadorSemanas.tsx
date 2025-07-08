// Caminho: src/components/ContadorSemanas.tsx
"use client";
import React from 'react';
import Image from 'next/image';

const ContadorSemanas = () => {
  const startDate = new Date('2025-01-13T00:00:00');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);

  return (
    <div className="absolute bottom-2 right-2 w-36 h-28 sm:w-44 sm:h-36">
      <Image src="/images/grafico-semanas.png" alt="Gráfico de semanas da mamãe" layout="fill" objectFit="contain" />
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-white text-5xl sm:text-6xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{weeks}</span>
      </div>
    </div>
  );
};

export default ContadorSemanas;