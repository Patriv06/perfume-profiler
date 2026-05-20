import React from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  User, 
  Heart, 
  Sparkles, 
  Trees, 
  Flower2, 
  Flame,
  Compass
} from 'lucide-react';

export default function Quiz({ step, answers, setAnswers, onNext, onBack }) {
  // Define questions data
  const questionConfig = {
    gender: {
      title: '¿A quién va dirigida la fragancia?',
      subtitle: 'Seleccioná el perfil de destino',
      key: 'gender',
      options: [
        { value: 'Hombre', label: 'Hombre', desc: 'Aromas masculinos e intensos', icon: User },
        { value: 'Mujer', label: 'Mujer', desc: 'Aromas femeninos y elegantes', icon: Heart },
        { value: 'Unisex', label: 'Unisex', desc: 'Aromas versátiles y compartidos', icon: Compass }
      ]
    },
    moment: {
      title: '¿En qué momento preferís usarla?',
      subtitle: 'Elige la ocasión ideal',
      key: 'moment',
      options: [
        { value: 'Día', label: 'Día', desc: 'Frescura, vitalidad y dinamismo', icon: Sun },
        { value: 'Noche', label: 'Noche', desc: 'Intensidad, sensualidad y misterio', icon: Moon }
      ]
    },
    note: {
      title: '¿Qué familia aromática te atrae más?',
      subtitle: 'Las notas predominantes de la fragancia',
      key: 'note',
      options: [
        { value: 'Cítrico', label: 'Cítrico', desc: 'Fresco, chispeante y enérgico', icon: Sparkles },
        { value: 'Amaderado', label: 'Amaderado', desc: 'Cálido, elegante y terroso', icon: Trees },
        { value: 'Floral', label: 'Floral', desc: 'Delicado, romántico y primaveral', icon: Flower2 },
        { value: 'Oriental', label: 'Oriental', desc: 'Dulce, exótico y especiado', icon: Flame }
      ]
    }
  };

  const currentQuestion = questionConfig[step];
  if (!currentQuestion) return null;

  // Progress percentage
  const progressSteps = ['gender', 'moment', 'note'];
  const stepIndex = progressSteps.indexOf(step);
  const progressPercentage = ((stepIndex + 1) / progressSteps.length) * 100;

  const handleSelect = (value) => {
    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }));
    // Small timeout for fluid transition feedback
    setTimeout(() => {
      onNext();
    }, 250);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 fade-in-slide" id={`quiz-step-${step}`}>
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          id="btn-quiz-back"
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-gold-300 transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
          Paso {stepIndex + 1} de {progressSteps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[2px] bg-luxury-gray rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Header */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-[0.05em] text-white mb-2">
          {currentQuestion.title}
        </h2>
        <p className="text-xs uppercase tracking-widest text-gold-400/70 font-light">
          {currentQuestion.subtitle}
        </p>
      </div>

      {/* Options Grid */}
      <div className={`grid gap-4 ${currentQuestion.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {currentQuestion.options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = answers[currentQuestion.key] === opt.value;
          
          return (
            <button
              key={opt.value}
              id={`option-${currentQuestion.key}-${opt.value.toLowerCase()}`}
              onClick={() => handleSelect(opt.value)}
              className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'border-gold-400 bg-gold-950/30 text-white shadow-[0_0_20px_rgba(197,161,84,0.15)]'
                  : 'border-white/5 bg-luxury-gray/50 text-gray-300 hover:border-gold-500/30 hover:bg-luxury-gray/80'
              }`}
            >
              {/* Icon Container */}
              <div className={`p-4 rounded-full mb-4 border transition-all duration-500 ${
                isSelected 
                  ? 'border-gold-400 bg-gold-400/10 text-gold-300' 
                  : 'border-white/5 bg-luxury-black/40 text-gray-400 group-hover:text-gold-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <span className={`font-serif text-lg tracking-wider mb-2 font-medium ${isSelected ? 'text-gold-300' : 'text-white'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-gray-400 font-light leading-relaxed max-w-[180px]">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
