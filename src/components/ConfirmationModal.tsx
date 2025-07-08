// Caminho: src/components/ConfirmationModal.tsx
"use client";
import React from 'react';

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
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-all">&#x2715;</button>
        <div className="mt-4 text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: modalText }} />
        <button onClick={onClose} className="mt-8 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 transition-transform transform hover:scale-105">OK</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;