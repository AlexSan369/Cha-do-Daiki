// Caminho: src/components/GuestCounter.tsx
"use client";
import React, { Dispatch, SetStateAction } from 'react';

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
        <button type="button" onClick={handleDecrement} disabled={count === min} className="w-10 h-10 text-2xl font-bold text-cyan-600 border-2 border-teal-600 rounded-full disabled:text-gray-300 disabled:border-gray-300">-</button>
        <span className="text-2xl font-bold text-gray-800 w-8 text-center">{count}</span>
        <button type="button" onClick={handleIncrement} className="w-10 h-10 text-2xl font-bold text-white bg-teal-500 border-2 border-teal-600 rounded-full">+</button>
      </div>
    </div>
  );
};

export default GuestCounter;