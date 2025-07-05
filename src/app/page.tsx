"use client";

import React, { useState, FormEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Aba = 'inicio' | 'confirmar' | 'presentear';

// --- COMPONENTE MODAL DE CONFIRMAÇÃO ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ConfirmationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const modalText = "Obrigado por confirmar sua presença, <br><br> para se manter atualizado salve o número da mamãe em seus contatos, <br><br> O nome Daiki tem origem japonesa e seu significado é a junção de duas palavras, sendo, <br> Dai (Grande) e Ki (Luz), resultando na ideia : \"Grande Luz\".";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="relative p-8 rounded-2xl shadow-lg body-background max-w-lg w-full text-center border-2 border-white/50">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-all">
          &#x2715;
        </button>
        <div className="mt-4 text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: modalText }} />
        <button onClick={onClose} className="mt-8 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 transition-transform transform hover:scale-105">
          OK
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE CONTADOR DE CONVIDADOS ---
interface GuestCounterProps {
  label: string;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  min?: number;
}
const GuestCounter: React.FC<GuestCounterProps> = ({ label, count, setCount, min = 0 }) => {
  const handleDecrement = () => { if (count > min) setCount(count - 1); };
  const handleIncrement = () => { setCount(count + 1); };

  return (
    <div className="flex items-center justify-between">
      <label className="text-lg font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <button type="button" onClick={handleDecrement} disabled={count === min} className="w-10 h-10 text-2xl font-bold text-cyan-600 border-2 border-cyan-600 rounded-full disabled:text-gray-300 disabled:border-gray-300">-</button>
        <span className="text-2xl font-bold text-gray-800 w-8 text-center">{count}</span>
        <button type="button" onClick={handleIncrement} className="w-10 h-10 text-2xl font-bold text-white bg-cyan-600 border-2 border-cyan-600 rounded-full">+</button>
      </div>
    </div>
  );
};

// --- COMPONENTE CONTADOR DE SEMANAS ---
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
        <span className="text-white text-5xl sm:text-6xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          {weeks}
        </span>
      </div>
    </div>
  );
};


//--- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('inicio');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const AbaInicio = () => (
    <>
      <div className="my-6 relative w-full max-w-md mx-auto">
        <Image src="/images/foto-principal.jpg" alt="Foto da mamãe do Daiki" width={600} height={800} className="rounded-xl shadow-md" />
        <ContadorSemanas />
      </div>
      <div className="text-gray-700 text-lg sm:text-xl space-y-4">
        <p className="font-semibold text-2xl text-cyan-700">É hora de celebrar a vida!</p>
        <p>Com o coração cheio de alegria, convidamos você para celebrar a chegada do nosso amado Daiki. Estamos preparando tudo com muito carinho para este momento e sua presença, mesmo que virtual, é o nosso maior presente. Vamos juntos compartilhar sorrisos e criar memórias inesquecíveis!</p>
      </div>
    </>
  );

  const AbaConfirmar = () => {
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [adultos, setAdultos] = useState(1);
    const [criancas, setCriancas] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!nome) {
        alert('Por favor, preencha seu nome.');
        return;
      }
      setIsLoading(true);
      try {
        await addDoc(collection(db, "convidados"), {
          nome, whatsapp, adultos, criancas,
          totalConvidados: adultos + criancas,
          confirmadoEm: new Date()
        });
        setIsModalOpen(true);
        setNome('');
        setWhatsapp('');
        setAdultos(1);
        setCriancas(0);
      } catch (error) {
        console.error("Erro ao confirmar presença: ", error);
        alert('Ocorreu um erro ao enviar sua confirmação. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="py-10 text-left">
        <h2 className="text-2xl font-bold text-cyan-800 text-center">Confirme sua Presença</h2>
        <p className="mt-2 text-center text-gray-600">Sua confirmação nos ajuda a organizar tudo com mais carinho!</p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Seu Nome Completo</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" placeholder="Nome de quem está confirmando" />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp (Opcional)</label>
            <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" placeholder="(XX) 9XXXX-XXXX" />
          </div>
          <div className="pt-4 space-y-4">
            <GuestCounter label="Adultos" count={adultos} setCount={setAdultos} min={1} />
            <GuestCounter label="Crianças" count={criancas} setCount={setCriancas} min={0} />
          </div>
          <div className="text-center pt-4">
            <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isLoading ? 'Enviando...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const AbaPresentear = () => {
    const [valorSelecionado, setValorSelecionado] = useState(50);
    const [valorCustom, setValorCustom] = useState('');
    const [inputAtivo, setInputAtivo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Valores para a barra de progresso (vamos torná-los dinâmicos depois)
    const meta = 2000;
    const arrecadado = 520; // Valor fixo para teste visual
    const porcentagem = (arrecadado / meta) * 100;

    const valoresSugeridos = [30, 50, 100];

    const handleSelecionarValor = (valor: number) => {
      setValorSelecionado(valor);
      setInputAtivo(false);
      setValorCustom('');
    };

    const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputAtivo(true);
      setValorCustom(e.target.value);
      setValorSelecionado(0); // Desseleciona os botões
    };
    
    const handlePagamento = async () => {
        const valorFinal = inputAtivo ? Number(valorCustom) : valorSelecionado;
        if (valorFinal <= 0) {
            alert("Por favor, selecione ou digite um valor para presentear.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Presente para o Chá de Bebê do Daiki',
                    unit_price: valorFinal,
                    quantity: 1,
                }),
            });

            if (!response.ok) {
              throw new Error("Falha ao criar o link de pagamento.");
            }

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert('Erro ao gerar link de pagamento.');
            }

        } catch (error) {
            console.error('Erro no pagamento:', error);
            alert('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
      <div className="py-10">
        <h2 className="text-2xl font-bold text-cyan-800 text-center">Presentear o Daiki</h2>
        <p className="mt-2 text-center text-gray-600">Sua contribuição ajudará a comprar um kit de fraldas ecológicas e outros itens essenciais!</p>
        
        {/* Barra de Progresso */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-cyan-700">Arrecadado: R$ {arrecadado.toFixed(2)}</span>
            <span className="text-base font-medium text-gray-500">Meta: R$ {meta.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div className="bg-gradient-to-r from-cyan-400 to-teal-500 h-4 rounded-full shadow-md" style={{ width: `${porcentagem}%` }}></div>
          </div>
        </div>

        {/* Seleção de Valor */}
        <div className="mt-8 max-w-md mx-auto">
            <p className="font-semibold text-lg text-center text-gray-700 mb-4">Escolha um valor:</p>
            <div className="grid grid-cols-3 gap-4">
                {valoresSugeridos.map(valor => (
                    <button 
                        key={valor}
                        onClick={() => handleSelecionarValor(valor)}
                        className={`p-4 rounded-lg text-xl font-bold border-2 transition-all ${!inputAtivo && valorSelecionado === valor ? 'bg-cyan-500 text-white border-cyan-700 shadow-lg' : 'bg-white text-cyan-700 border-gray-300 hover:border-cyan-500'}`}
                    >
                        R$ {valor}
                    </button>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Ou digite outro valor:</p>
                <input 
                    type="number"
                    value={valorCustom}
                    onChange={handleCustomInputChange}
                    className="w-full max-w-xs mx-auto p-3 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="R$ 0,00"
                />
            </div>
        </div>

        {/* Botão de Pagamento */}
        <div className="mt-10 text-center">
            <button
              onClick={handlePagamento}
              disabled={isLoading}
              className="w-full max-w-md mx-auto inline-flex justify-center py-4 px-8 border border-transparent shadow-lg text-lg font-bold rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
              {isLoading ? 'Gerando link...' : 'Pagar com Mercado Pago'}
            </button>
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="relative w-full h-48 sm:h-56 rounded-t-2xl flex flex-col justify-center items-center text-center p-4" style={{ backgroundImage: "url('/images/fundo-header.png')", backgroundSize: 'cover', backgroundPosition: 'bottom' }}>
          <h1 className="text-4xl sm:text-6xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Chá de Bebê</h1>
          <h2 className="text-5xl sm:text-7xl font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Daiki</h2>
          <div className='absolute top-2 right-2 w-28 h-28 sm:w-36 sm:h-36'>
            <Image src="/images/cegonha-principal.png" alt="Cegonha" layout="fill" objectFit='contain' />
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
      <footer className="w-full h-32 mt-10" style={{ backgroundImage: "url('/images/fundo-footer.png')", backgroundSize: 'contain', backgroundPosition: 'bottom center', backgroundRepeat: 'no-repeat' }}></footer>
      
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}