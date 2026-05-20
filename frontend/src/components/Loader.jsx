import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Loader() {
  const [loadingText, setLoadingText] = useState('Analizando tus preferencias...');

  const phrases = [
    'Analizando tus preferencias...',
    'Consultando la matriz de fragancias...',
    'Evaluando notas de salida y fondos...',
    'Seleccionando el aroma ideal para vos...'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setLoadingText(phrases[index]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-8 fade-in-slide" id="loader-screen">
      {/* Premium Loading Animation */}
      <div className="relative w-24 h-24 mb-8">
        {/* Animated glowing rings */}
        <div className="absolute inset-0 rounded-full border border-gold-500/10 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border border-gold-400/20 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full border-t border-b border-gold-300 animate-spin duration-1000"></div>
        
        {/* Central Core */}
        <div className="absolute inset-6 rounded-full bg-luxury-gray border border-gold-400/30 flex items-center justify-center text-gold-300">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Loading Texts */}
      <h3 className="font-serif text-lg font-light tracking-[0.1em] text-white mb-2">
        DISEÑANDO RECOMENDACIÓN
      </h3>
      <p className="text-xs font-mono tracking-widest text-gold-400/70 transition-all duration-300 animate-pulse">
        {loadingText}
      </p>
    </div>
  );
}
