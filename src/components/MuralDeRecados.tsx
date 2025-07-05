// Caminho: src/components/MuralDeRecados.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface Recado {
  id: string;
  nome: string;
  mensagem: string;
  cor: string;
}

const postItColors = [
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
];

const MuralDeRecados = () => {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'recados'), orderBy('confirmadoEm', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recadosData = querySnapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome,
          mensagem: data.mensagem,
          cor: postItColors[index % postItColors.length]
        };
      });
      setRecados(recadosData);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novaMensagem.trim()) {
      setError('Por favor, preencha seu nome e a mensagem.');
      return;
    }
    if (novaMensagem.length > 100) {
      setError('Sua mensagem não pode ter mais de 100 caracteres.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'recados'), {
        nome: novoNome,
        mensagem: novaMensagem,
        confirmadoEm: serverTimestamp()
      });
      setNovoNome('');
      setNovaMensagem('');
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar seu recado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="mural" className="w-full max-w-4xl mt-10 text-center">
      {/* --- INÍCIO DA MUDANÇA --- */}
      
      {/* Caixa 1: Apenas o Formulário */}
      <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-cyan-800 mb-6">Mural de Recados</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-left space-y-4">
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Seu nome"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
          <textarea
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Deixe sua mensagem de carinho... (até 100 caracteres)"
            maxLength={100}
            rows={3}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
           <div className="text-right text-sm text-gray-500">
            {novaMensagem.length}/100
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-6 text-lg font-bold rounded-md text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400">
            {isLoading ? 'Enviando...' : 'Deixar Recado'}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>

      {/* Caixa 2: Apenas os Post-its, com uma margem no topo */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recados.map(recado => (
          <div key={recado.id} className={`p-6 rounded-lg shadow-xl transform hover:-rotate-3 transition-transform ${recado.cor}`}>
            <p className="font-bold text-gray-800 text-xl text-center mb-4" style={{fontFamily: 'cursive'}}>
              {recado.nome}
            </p>
            <p className="text-gray-700 break-words">
              {recado.mensagem}
            </p>
          </div>
        ))}
      </div>

      {/* --- FIM DA MUDANÇA --- */}
    </section>
  );
};

export default MuralDeRecados;