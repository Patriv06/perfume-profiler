import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }
  // Map production/subdomain port swaps
  return window.location.origin
    .replace(':8081', ':5001')
    .replace(':8080', ':5000')
    .replace(':5173', ':5001');
};

const QuizWidget = ({ storeId }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('welcome'); // 'welcome' | 'quiz' | 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const API_URL = getApiUrl();

  useEffect(() => {
    if (!storeId) return;

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
  }, [storeId]);

  // Inject CSS variables for theme customization
  useEffect(() => {
    if (!config || !config.theme) return;
    const theme = config.theme;
    
    document.documentElement.style.setProperty('--widget-accent', theme.accent_color || '#722F37');
    document.documentElement.style.setProperty('--widget-bg', theme.background_color || '#1A1112');
    document.documentElement.style.setProperty('--widget-text', theme.text_color || '#ffffff');
  }, [config]);

  if (loading) {
    return (
      <div className="widget-loading-screen">
        <div className="widget-spinner"></div>
        <p>Cargando Asistente Inteligente...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="widget-error-screen">
        <div className="error-icon">⚠️</div>
        <p>{error || 'Asistente no configurado'}</p>
      </div>
    );
  }

  const { title, welcome_text, theme, questions } = config;

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
      // Calculate recommendation
      setLoadingRecommendation(true);
      setStep('result');
      
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

    // 1. PostMessage to parent (widget.js) for native add-to-cart injection on main page
    window.parent.postMessage({
      action: 'smart_assistant_add_to_cart',
      product_id: prod.tiendanube_id,
      variant_id: prod.variant_id
    }, '*');

    // Simulate add action delay for visual feedback
    setTimeout(() => {
      setAddingToCart(false);
      setAddedToCart(true);
      
      // Reset text feedback after 3 seconds
      setTimeout(() => setAddedToCart(false), 3000);
    }, 1200);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="widget-container">
      {step === 'welcome' && (
        <div className="widget-card welcome-view fade-in">
          <div className="widget-logo">💡</div>
          <h1 className="widget-title">{title}</h1>
          <p className="widget-welcome-text">{welcome_text}</p>
          <button 
            className="widget-btn-primary" 
            onClick={handleStart}
          >
            {theme.button_text || 'Comenzar'}
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
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
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
              <div className="widget-spinner"></div>
              <p className="pulse-text">Analizando tu perfil...</p>
            </div>
          ) : recommendation && recommendation.recommendation ? (
            <div className="result-content">
              <div className="result-badge">🍷 ¡Recomendación Ideal!</div>
              
              <div className="recommended-product-card">
                <div className="prod-img-wrapper">
                  <img 
                    src={recommendation.recommendation.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400'} 
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
              <button className="widget-btn-primary" onClick={handleStart}>
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
