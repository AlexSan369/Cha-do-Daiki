// Caminho: src/components/HowItWorksModal.tsx
"use client";

import React from 'react';

// Definindo a interface para as propriedades do componente
interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    number: 1,
    title: "Convite Online",
    description: "Essa é a vaquinha para as Fraldas do Daiki, , contribua com o valor que puder para ajudar a comprar as fraldas."
  },
  {
    number: 2,
    title: "Presentes",
    description: "Optamos em utilizar fraldas ecológicas, pensando na saúde do Daiki e do planeta. Cada Fralda Eco custa igual um pacote de fraldas convencional de 45 ~ 55 reais."
  },
  {
    number: 3,
    title: "O que são Fraldas ecológicas?",
    description: "São fraldas de pano modernas e reutilizáveis, que evitam alergias e geram menos lixo para o meio ambiente."
  },
  {
    number: 4,
    title: "Sobre o Evento",
    description: "O Chá de Bebê do Daiki será no dia 29/08/2025, às 15:00, na Rua teste, 123, Tamandaré - PE. Será uma festa linda com muito amor e alegria!"
  },
];

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Overlay escuro
    <div className="fixed inset-0 body-bg bg-opacity-80 flex justify-center items-center z-50 p-4 font-sans">
      
      {/* Caixa do Modal com fundo escuro */}
      <div className="relative p-6 sm:p-8 rounded-2xl shadow-lg bg-[#2f67c3] max-w-2xl w-full text-white border border-gray-700">
        
        {/* Botão de Fechar (X) */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Títulos */}
        <h2 className="text-3xl font-bold text-center text-gray-100">Como Funciona o Chá do Daiki</h2>
        <p className="text-center text-gray-400 mt-2">Veja como é simples participar e celebrar com a gente.</p>

        {/* === INÍCIO DA MUDANÇA DE LAYOUT === */}
        {/* Grid com os Passos - agora centralizados */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
          {steps.map(step => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-cyan-600 text-white font-bold text-xl shadow-md">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-50 mt-4">{step.title}</h3>
              <p className="mt-2 text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
        {/* === FIM DA MUDANÇA DE LAYOUT === */}

        {/* Botão Principal com ícone */}
        <div className="mt-12 text-center">
            <button 
              onClick={onClose} 
              className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
            >
              {/* Ícone de Coração */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Começar Agora</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;