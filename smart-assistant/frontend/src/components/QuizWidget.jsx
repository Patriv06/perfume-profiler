import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }
  if (window.location.hostname === 'asistente.quanticia.com.ar') {
    return 'https://asistente-api.quanticia.com.ar';
  }
  return window.location.origin
    .replace(':8081', ':5001')
    .replace(':8080', ':5000')
    .replace(':5173', ':5001');
};

const LOCAL_PRODUCTS = {
  vinos: [
    {
      id: 'vin1',
      name: 'Gran Reserva Malbec',
      price: 8500,
      description: 'Vino tinto con cuerpo, aromas a ciruelas maduras y sutiles notas de roble. Ideal para maridar carnes rojas y asados.',
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tipo: 'tinto', maridaje: 'carnes' }
    },
    {
      id: 'vin2',
      name: 'Chardonnay Premium',
      price: 7200,
      description: 'Vino blanco fresco, de acidez equilibrada con notas a manzana verde y vainilla. Perfecto para pastas o pescados.',
      image_url: 'https://images.unsplash.com/photo-1569919650476-f5421b524738?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tipo: 'blanco', maridaje: 'pastas_pescado' }
    },
    {
      id: 'vin3',
      name: 'Rosado Dulce del Valle',
      price: 6800,
      description: 'Rosado suave y aromático con notas a frutos rojos. Muy fácil de beber, ideal para picadas, quesos suaves o postres.',
      image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tipo: 'rosado', maridaje: 'quesos_postres' }
    }
  ],
  perfumes: [
    {
      id: 'perf1',
      name: 'Absolute Gold Oud',
      price: 15500,
      description: 'Fragancia de alta gama, intensa y seductora, con notas dominantes de sándalo, cuero y maderas exóticas. Perfecta para citas.',
      image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { intensidad: 'intensa', ocasion: 'noche' }
    },
    {
      id: 'perf2',
      name: 'Citric Sport Fresh',
      price: 11200,
      description: 'Esencia cítrica vibrante con toques refrescantes de menta, pomelo y bergamota. Excelente para el uso diario y la oficina.',
      image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { intensidad: 'fresca', ocasion: 'diario' }
    },
    {
      id: 'perf3',
      name: 'Bloom Floral Kiss',
      price: 12400,
      description: 'Un viaje aromático de jazmines, rosas blancas y un sutil fondo de vainilla. Una opción alegre para fiestas y aire libre.',
      image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { intensidad: 'dulce', ocasion: 'fiesta' }
    }
  ],
  chocolates: [
    {
      id: 'choc1',
      name: 'Barra Dark Intensa 80%',
      price: 3500,
      description: 'Chocolate negro profundo elaborado con granos de cacao seleccionados. Ideal para amantes del sabor puro e intenso.',
      image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { cacao: 'amargo', adicional: 'puro' }
    },
    {
      id: 'choc2',
      name: 'Bombón Avellana Gold',
      price: 4200,
      description: 'Chocolates con leche extra cremosos rellenos de una suave crema de avellanas y trocitos crocantes tostados.',
      image_url: 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { cacao: 'leche', adicional: 'frutos' }
    },
    {
      id: 'choc3',
      name: 'White Truffle Coco & Manjar',
      price: 3800,
      description: 'Trufas artesanales de chocolate blanco rellenas con crema de coco natural y un corazón de dulce de leche.',
      image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { cacao: 'blanco', adicional: 'relleno' }
    }
  ],
  ropa: [
    {
      id: 'rop1',
      name: 'Saco Lana Premium Corte Italiano',
      price: 45000,
      description: 'Tapado de lana de abrigo pesado, corte entallado y terminaciones artesanales en solapa. Diseño clásico y elegante.',
      image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { estilo: 'elegante', clima: 'frio' }
    },
    {
      id: 'rop2',
      name: 'Remera Algodón Orgánico Oversize',
      price: 15000,
      description: 'Remera unisex confeccionada en algodón 100% orgánico certificado. Suave al tacto y de horma relajada para climas cálidos.',
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { estilo: 'casual', clima: 'calido' }
    },
    {
      id: 'rop3',
      name: 'Campera Puffer Tech Streetwear',
      price: 38000,
      description: 'Campera inflable con aislamiento térmico ecológico. Tela exterior impermeable, bolsillos con cierres termosellados y capucha.',
      image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { estilo: 'urbano', clima: 'frio' }
    }
  ],
  cafe: [
    {
      id: 'caf1',
      name: 'Gran Espresso Blend',
      price: 9500,
      description: 'Granos seleccionados con un tostado oscuro e intenso. Presenta notas marcadas a cacao amargo, nueces y crema densa.',
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tostado: 'oscuro', preparacion: 'espresso' }
    },
    {
      id: 'caf2',
      name: 'Geisha Honey Colombia',
      price: 14000,
      description: 'Café de especialidad de origen único con tostado claro. Ofrece notas florales a jazmín, durazno maduro y acidez cítrica brillante.',
      image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tostado: 'claro', preparacion: 'filtrado' }
    },
    {
      id: 'caf3',
      name: 'Mocha Beans Selection',
      price: 8900,
      description: 'Tostado medio equilibrado. Con notas a avellana tostada y cuerpo sedoso, ideal para preparar capuccinos y lattes con leche.',
      image_url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=400',
      canonical_url: 'https://asistente.quanticia.com.ar/',
      tags: { tostado: 'medio', preparacion: 'con_leche' }
    }
  ]
};

const getCategoryDetails = (category) => {
  switch (category) {
    case 'perfumes':
      return { badge: '✨ Fragancia Recomendada', logo: '✨' };
    case 'chocolates':
      return { badge: '🍫 Chocolate Recomendado', logo: '🍫' };
    case 'ropa':
      return { badge: '👕 Outfit Recomendado', logo: '👕' };
    case 'cafe':
      return { badge: '☕ Café Recomendado', logo: '☕' };
    case 'vinos':
    default:
      return { badge: '🍷 Recomendación Ideal', logo: '🍷' };
  }
};

const calculateRecommendationLocal = (category, answers) => {
  const products = LOCAL_PRODUCTS[category] || LOCAL_PRODUCTS.vinos;
  const scored = products.map(prod => {
    let score = 0;
    Object.keys(answers).forEach(key => {
      if (prod.tags[key] === answers[key]) {
        score += 1;
      }
    });
    return { ...prod, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
};

const QuizWidget = ({ storeId, isPlayground = false, previewConfig = null, onAddToCartSimulated = null }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(!isPlayground);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const API_URL = getApiUrl();
  const activeConfig = isPlayground ? previewConfig : config;

  useEffect(() => {
    if (isPlayground || !storeId) return;

    setLoading(true);
    axios.get(`${API_URL}/api/widget/config?store_id=${storeId}`)
      .then(res => {
        setConfig(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching widget configuration:', err);
        setError('No se pudo cargar la configuración del asistente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [storeId, isPlayground]);

  if (isPlayground ? !previewConfig : (loading || !config)) {
    if (!isPlayground && loading) {
      return (
        <div className="widget-loading-screen">
          <div className="widget-spinner"></div>
          <p>Cargando Asistente Inteligente...</p>
        </div>
      );
    }
    if (!isPlayground && (error || !config)) {
      return (
        <div className="widget-error-screen">
          <div className="error-icon">⚠️</div>
          <p>{error || 'Asistente no configurado'}</p>
        </div>
      );
    }
    return (
      <div className="widget-loading-screen">
        <p>Cargando previsualización...</p>
      </div>
    );
  }

  const { title, welcome_text, theme, questions } = activeConfig;

  const handleStart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStep('quiz');
  };

  const handleOptionSelect = (tagKey, optionValue) => {
    const updatedAnswers = { ...answers, [tagKey]: optionValue };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setLoadingRecommendation(true);
      setStep('result');
      
      if (isPlayground) {
        setTimeout(() => {
          const recProd = calculateRecommendationLocal(activeConfig.category, updatedAnswers);
          setRecommendation({ recommendation: recProd });
          setLoadingRecommendation(false);
        }, 1200);
      } else {
        axios.get(`${API_URL}/api/recommend`, {
          params: {
            store_id: storeId,
            answers: JSON.stringify(updatedAnswers)
          }
        })
        .then(res => {
          setRecommendation(res.data);
        })
        .catch(err => {
          console.error('Error fetching recommendation:', err);
          setError('Error al obtener la recomendación.');
        })
        .finally(() => {
          setLoadingRecommendation(false);
        });
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStep('welcome');
    }
  };

  const handleAddToCart = () => {
    if (!recommendation || !recommendation.recommendation) return;
    const prod = recommendation.recommendation;
    
    setAddingToCart(true);

    if (isPlayground) {
      setTimeout(() => {
        setAddingToCart(false);
        setAddedToCart(true);
        if (onAddToCartSimulated) {
          onAddToCartSimulated(prod);
        }
        setTimeout(() => setAddedToCart(false), 3000);
      }, 1200);
    } else {
      window.parent.postMessage({
        action: 'smart_assistant_add_to_cart',
        product_id: prod.tiendanube_id,
        variant_id: prod.variant_id
      }, '*');

      setTimeout(() => {
        setAddingToCart(false);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      }, 1200);
    }
  };

  const currentQuestion = questions && questions[currentQuestionIndex];
  const progressPercent = (questions && questions.length > 0) ? ((currentQuestionIndex) / questions.length) * 100 : 0;
  const catDetails = getCategoryDetails(activeConfig.category);

  return (
    <div 
      className="widget-container"
      style={{
        '--widget-accent': theme?.accent_color || '#722F37',
        '--widget-bg': theme?.background_color || '#1A1112',
        '--widget-text': theme?.text_color || '#ffffff',
        width: isPlayground ? '100%' : '100vw',
        height: isPlayground ? '100%' : '100vh',
      }}
    >
      {step === 'welcome' && (
        <div className="widget-card welcome-view fade-in">
          <div className="widget-logo">{catDetails.logo}</div>
          <h1 className="widget-title">{title}</h1>
          <p className="widget-welcome-text">{welcome_text}</p>
          <button 
            className="widget-btn-primary" 
            onClick={handleStart}
            style={{ backgroundColor: 'var(--widget-accent)' }}
          >
            {theme?.button_text || 'Comenzar'}
          </button>
        </div>
      )}

      {step === 'quiz' && currentQuestion && (
        <div className="widget-card quiz-view fade-in">
          <div className="quiz-header">
            <button className="widget-btn-back" onClick={handleBack}>
              ← Volver
            </button>
            <span className="quiz-steps">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--widget-accent)' }}></div>
          </div>

          <h2 className="quiz-question-text">{currentQuestion.text}</h2>

          <div className="options-grid">
            {currentQuestion.options.map((opt, idx) => (
              <div 
                key={idx} 
                className="option-card"
                onClick={() => handleOptionSelect(currentQuestion.tag_key, opt.value)}
              >
                <span className="option-icon">{opt.icon}</span>
                <span className="option-text">{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="widget-card result-view fade-in">
          {loadingRecommendation ? (
            <div className="result-loader-container">
              <div className="widget-spinner" style={{ borderTopColor: 'var(--widget-accent)' }}></div>
              <p className="pulse-text">Analizando tu perfil...</p>
            </div>
          ) : recommendation && recommendation.recommendation ? (
            <div className="result-content">
              <div className="result-badge" style={{ color: 'var(--widget-accent)' }}>{catDetails.badge}</div>
              
              <div className="recommended-product-card">
                <div className="prod-img-wrapper">
                  <img 
                    src={recommendation.recommendation.image_url} 
                    alt={recommendation.recommendation.name} 
                    className="prod-img"
                  />
                </div>
                <div className="prod-info">
                  <h3 className="prod-title">{recommendation.recommendation.name}</h3>
                  <div className="prod-price">${parseFloat(recommendation.recommendation.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
                  <p className="prod-desc">{recommendation.recommendation.description}</p>
                </div>
              </div>

              <div className="action-buttons-group">
                <button 
                  className={`widget-btn-primary add-to-cart-btn ${addedToCart ? 'success-btn' : ''}`}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  style={{
                    backgroundColor: 'var(--widget-accent)'
                  }}
                >
                  {addingToCart ? (
                    <span className="mini-spinner"></span>
                  ) : addedToCart ? (
                    '✓ ¡Agregado al Carrito!'
                  ) : (
                    'Agregar al Carrito 🛒'
                  )}
                </button>
                
                <div className="secondary-buttons">
                  <a 
                    href={recommendation.recommendation.canonical_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="widget-btn-secondary view-detail-btn"
                  >
                    Ver en Tienda ↗
                  </a>
                  
                  <button 
                    className="widget-btn-secondary restart-btn"
                    onClick={handleStart}
                  >
                    Hacer de nuevo ↺
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="widget-error-screen">
              <p>No se encontró un producto que coincida con tu perfil.</p>
              <button className="widget-btn-primary" onClick={handleStart} style={{ backgroundColor: 'var(--widget-accent)' }}>
                Volver a Intentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizWidget;
