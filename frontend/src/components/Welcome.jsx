import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

export default function Welcome({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 py-8 fade-in-slide" id="welcome-screen">
      {/* Decorative Brand Accent */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-[1px] w-8 bg-gold-400/40"></div>
        <span className="text-xs uppercase tracking-[0.3em] text-gold-300 font-medium">BANDERAS PERFUMES</span>
        <div className="h-[1px] w-8 bg-gold-400/40"></div>
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-[0.08em] mb-6 max-w-3xl">
        ENCONTRÁ TU <br />
        <span className="text-gold-gradient font-semibold">FRAGANCIA IDEAL</span>
      </h1>

      {/* Description */}
      <p className="font-sans text-sm md:text-base text-gray-400 max-w-lg leading-relaxed mb-12 tracking-wide font-light">
        Respondé unas breves preguntas sobre tus preferencias y momento de uso, y te recomendaremos el perfume perfecto para vos.
      </p>

      {/* CTA Button */}
      <button
        id="btn-start-experience"
        onClick={onStart}
        className="group relative px-8 py-4 bg-transparent border border-gold-400 text-gold-200 uppercase text-xs tracking-[0.25em] font-semibold overflow-hidden transition-all duration-300 hover:text-luxury-black hover:border-gold-300 focus:outline-none cursor-pointer glass-panel-hover"
      >
        {/* Sliding background hover effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10"></span>
        
        <span className="flex items-center justify-center gap-2">
          Comenzar Experiencia
          <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </button>

      {/* Subtle Bottom Accent */}
      <div className="mt-16 flex items-center justify-center gap-1 opacity-20">
        <Sparkles className="w-3 h-3 text-gold-300" />
        <Sparkles className="w-4 h-4 text-gold-300" />
        <Sparkles className="w-3 h-3 text-gold-300" />
      </div>
    </div>
  );
}
