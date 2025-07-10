// Caminho: src/components/MuralDeRecados.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot, onSnapshot } from 'firebase/firestore';

interface Recado {
  id: string;
  nome: string;
  mensagem: string;
  isDoador: boolean;
}

const postItColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200'];
const RECADO_LIMIT = 6;

const MuralDeRecados = () => {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'recados'), orderBy('confirmadoEm', 'desc'), limit(RECADO_LIMIT));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recadosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recado));
      setRecados(recadosData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === RECADO_LIMIT);
    });
    return () => unsubscribe();
  }, []);

  const fetchMoreRecados = async () => {
    if (!lastVisible) return;
    setLoadingMore(true);
    const nextQuery = query(collection(db, 'recados'), orderBy('confirmadoEm', 'desc'), startAfter(lastVisible), limit(RECADO_LIMIT));
    const documentSnapshots = await getDocs(nextQuery);
    const newRecados = documentSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recado));
    setRecados(prevRecados => [...prevRecados, ...newRecados]);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    setHasMore(documentSnapshots.docs.length === RECADO_LIMIT);
    setLoadingMore(false);
  };

  return (
    <section id="mural" className="w-full max-w-4xl mt-10 text-center">
      <h2 className="text-3xl font-bold text-[#c9a58f] mb-8">Deixe sua Mensagens para o Daiki</h2>
      
      {recados.length === 0 && !loadingMore && (
        <p className="text-gray-500">Nenhum recado ainda. Seja o primeiro!</p>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recados.map((recado, index) => {
          const isDonorPost = recado.isDoador;
          const normalColor = postItColors[index % postItColors.length];
          const postItClasses = isDonorPost ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 border-2 border-amber-500 shadow-yellow-500/50' : `${normalColor} border-2 border-transparent`;
          const nameClasses = isDonorPost ? 'text-amber-900' : 'text-gray-800';
          const messageClasses = isDonorPost ? 'text-amber-800' : 'text-gray-700';

          return (
            <div key={recado.id} className={`p-6 rounded-lg shadow-xl transform hover:-rotate-3 transition-transform flex flex-col justify-between min-h-[180px] ${postItClasses}`}>
              <div>
                <div className={`font-bold text-xl text-center mb-4 flex items-center justify-center gap-2 ${nameClasses}`} style={{fontFamily: 'cursive'}}>
                  <span>{recado.nome}</span>
                  {isDonorPost && <span title="Agradecemos o presente!">❤️</span>}
                </div>
                <p className={`break-words ${messageClasses}`}>{recado.mensagem}</p>
              </div>
              {isDonorPost && (<p className="mt-4 text-right text-xs italic text-amber-900/80">Agradecemos o presente!</p>)}
            </div>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button onClick={fetchMoreRecados} disabled={loadingMore} className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-md hover:bg-cyan-600 transition-all disabled:bg-gray-400">
            {loadingMore ? 'Carregando...' : 'Carregar Mais Recados'}
          </button>
        </div>
      )}
    </section>
  );
};

export default MuralDeRecados;