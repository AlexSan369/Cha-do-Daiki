// Caminho: src/components/MuralDeRecados.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface Recado {
  id: string;
  nome: string;
  mensagem: string;
  cor: string;
}

const postItColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200'];
const RECADO_LIMIT = 9; // Limite de recados por página

const MuralDeRecados = () => {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Efeito para buscar os recados iniciais
  useEffect(() => {
    const q = query(
      collection(db, 'recados'), 
      orderBy('confirmadoEm', 'desc'), 
      limit(RECADO_LIMIT)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // --- INÍCIO DA CORREÇÃO ---
      // Usamos .docs.map() que nos dá o 'doc' e o 'index'
      const recadosData = querySnapshot.docs.map((doc, index) => {
        const data = doc.data();
        return { // O .map precisa que a gente retorne o novo objeto
          id: doc.id,
          nome: data.nome,
          mensagem: data.mensagem,
          cor: postItColors[index % postItColors.length]
        };
      });
      // --- FIM DA CORREÇÃO ---
      
      setRecados(recadosData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === RECADO_LIMIT);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novaMensagem.trim()) { setError('Por favor, preencha seu nome e a mensagem.'); return; }
    if (novaMensagem.length > 100) { setError('Sua mensagem não pode ter mais de 100 caracteres.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'recados'), { nome: novoNome, mensagem: novaMensagem, confirmadoEm: serverTimestamp() });
      setNovoNome('');
      setNovaMensagem('');
    } catch (err) { console.error(err); setError('Ocorreu um erro ao enviar seu recado.');
    } finally { setIsLoading(false); }
  };

  const fetchMoreRecados = async () => {
    if (!lastVisible) return;
    setLoadingMore(true);
    const nextQuery = query(
      collection(db, 'recados'),
      orderBy('confirmadoEm', 'desc'),
      startAfter(lastVisible),
      limit(RECADO_LIMIT)
    );
    const documentSnapshots = await getDocs(nextQuery);
    const newRecados = documentSnapshots.docs.map((doc, index) => {
        const data = doc.data();
        const colorIndex = (recados.length + index) % postItColors.length;
        return {
            id: doc.id,
            nome: data.nome,
            mensagem: data.mensagem,
            cor: postItColors[colorIndex]
        };
    });
    setRecados(prevRecados => [...prevRecados, ...newRecados]);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    setHasMore(documentSnapshots.docs.length === RECADO_LIMIT);
    setLoadingMore(false);
  };

  return (
    <section id="mural" className="w-full max-w-4xl mt-10 text-center">
      <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-cyan-800 mb-6">Mural de Recados</h2>
        <form onSubmit={handleSubmit} className="mb-10 max-w-lg mx-auto text-left space-y-4">
          <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Seu nome" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
          <textarea value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} placeholder="Deixe sua mensagem de carinho... (até 100 caracteres)" maxLength={100} rows={3} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
          <div className="text-right text-sm text-gray-500">{novaMensagem.length}/100</div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-6 text-lg font-bold rounded-md text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400">
            {isLoading ? 'Enviando...' : 'Deixar Recado'}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recados.map(recado => (
          <div key={recado.id} className={`p-6 rounded-lg shadow-xl transform hover:-rotate-3 transition-transform ${recado.cor}`}>
            <p className="font-bold text-gray-800 text-xl text-center mb-4" style={{ fontFamily: 'cursive' }}>{recado.nome}</p>
            <p className="text-gray-700 break-words">{recado.mensagem}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={fetchMoreRecados}
            disabled={loadingMore}
            className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-md hover:bg-cyan-600 transition-all disabled:bg-gray-400"
          >
            {loadingMore ? 'Carregando...' : 'Carregar Mais Recados'}
          </button>
        </div>
      )}
    </section>
  );
};

export default MuralDeRecados;