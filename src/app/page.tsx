"use client";

import { useState } from 'react';
import Image from 'next/image';

// Definição dos tipos de abas para o TypeScript
type Aba = 'inicio' | 'confirmar' | 'presentear';

// COMPONENTE CONTADOR DE SEMANAS - VERSÃO AJUSTADA PARA SOBREPOSIÇÃO
const ContadorSemanas = () => {
  const startDate = new Date('2025-01-13T00:00:00');
  const today = new Date();
  
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return (
    // Container absoluto, posicionado no canto inferior direito
    <div className="absolute top-110 left-80 w-46 h-38 sm:w-54 sm:h-46">
      <Image
        src="/images/grafico-semanas.png"
        alt="Gráfico de semanas da mamãe"
        layout="fill"
        objectFit="contain"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-white text-5xl sm:text-6xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          {weeks}
        </span>
      </div>
    </div>
  );
};


export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('inicio');

  // ABA INÍCIO - AGORA COM O CONTADOR INTEGRADO
  const AbaInicio = () => (
    <>
      {/* O container da imagem agora é 'relative' para "ancorar" o contador */}
      <div className="my-6 relative w-full max-w-md mx-auto">
        <Image
          src="/images/foto-principal.jpg"
          alt="Foto da mamãe do Daiki"
          width={600}
          height={800}
          className="rounded-xl shadow-md"
        />
        {/* Chamamos o contador AQUI, dentro do container da foto */}
        <ContadorSemanas />
      </div>
      <div className="text-gray-700 text-lg sm:text-xl space-y-4">
        <p className="font-semibold text-2xl text-cyan-700">
          É hora de celebrar a vida!
        </p>
        <p>
          Com o coração cheio de alegria, convidamos você para celebrar a chegada do nosso amado Daiki. Estamos preparando tudo com muito carinho para este momento e sua presença, mesmo que virtual, é o nosso maior presente. Vamos juntos compartilhar sorrisos e criar memórias inesquecíveis!
        </p>
      </div>
    </>
  );

  const AbaConfirmar = () => (
    <div className="py-20">
      <h2 className="text-2xl font-bold text-cyan-800">Confirme sua Presença</h2>
      <p className="mt-4">Aqui ficará o formulário para Nome e WhatsApp.</p>
    </div>
  );

  const AbaPresentear = () => (
    <div className="py-20">
      <h2 className="text-2xl font-bold text-cyan-800">Presentear o Daiki</h2>
      <p className="mt-4">Aqui ficará a nossa Barra de Progresso e as opções de presente via Pix.</p>
    </div>
  );

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      
      <div className="w-full max-w-4xl">
        <header 
          className="relative w-full h-48 sm:h-56 rounded-t-2xl flex flex-col justify-center items-center text-center p-4"
          style={{ backgroundImage: "url('/images/fundo-header.png')", backgroundSize: 'cover', backgroundPosition: 'bottom' }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Chá de Bebê
          </h1>
          <h2 className="text-5xl sm:text-7xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Daiki
          </h2>
          <div className='absolute top-2 right-2 w-28 h-28 sm:w-36 sm:h-36'>
            <Image src="/images/cegonha-principal.png" alt="Cegonha" layout="fill" objectFit='contain'/>
          </div>
        </header>

        <div className="w-full bg-white/90 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
          <nav className="flex justify-center flex-wrap space-x-1 sm:space-x-4 border-b-2 border-cyan-200 pb-3">
            <button onClick={() => setAbaAtiva('inicio')} className={`px-3 py-2 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ${abaAtiva === 'inicio' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-600 hover:bg-cyan-100'}`}>Início</button>
            <button onClick={() => setAbaAtiva('confirmar')} className={`px-3 py-2 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ${abaAtiva === 'confirmar' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-600 hover:bg-cyan-100'}`}>Confirmar Presença</button>
            <button onClick={() => setAbaAtiva('presentear')} className={`px-3 py-2 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ${abaAtiva === 'presentear' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-600 hover:bg-cyan-100'}`}>Presentear</button>
            <a href="#mural" className="px-3 py-2 text-sm sm:text-base rounded-lg font-semibold text-gray-600 hover:bg-cyan-100 transition-all duration-300">Mural de Recados</a>
          </nav>
          
          <div className="mt-6 text-center">
            {abaAtiva === 'inicio' && <AbaInicio />}
            {abaAtiva === 'confirmar' && <AbaConfirmar />}
            {abaAtiva === 'presentear' && <AbaPresentear />}
          </div>
        </div>
      </div>

      <section id="mural" className="w-full max-w-4xl mt-10 text-center">
        <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-h-[300px]">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">Mural de Recados</h2>
          <p>O mural de recados para o Daiki ficará aqui...</p>
        </div>
      </section>
    </main>
  );
}