import React, { useState, useEffect } from 'react';
import QuizWidget from './QuizWidget';

const CATEGORY_TEMPLATES = {
  vinos: {
    category: 'vinos',
    title: '¿Cuál es tu Vino ideal?',
    welcome_text: 'Respondé 2 preguntas rápidas y nuestro sumiller inteligente te recomendará la botella perfecta para tu ocasión.',
    button_text: 'Comenzar 🍷',
    accent_color: '#722F37',
    background_color: '#1A1112',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Qué tipo de vino preferís?',
        tag_key: 'tipo',
        options: [
          { text: 'Tinto 🍷', value: 'tinto', icon: '🍷' },
          { text: 'Blanco 🥂', value: 'blanco', icon: '🥂' },
          { text: 'Rosado 🌸', value: 'rosado', icon: '🌸' }
        ]
      },
      {
        text: '¿Qué maridaje tenés en mente?',
        tag_key: 'maridaje',
        options: [
          { text: 'Carnes Rojas 🥩', value: 'carnes', icon: '🥩' },
          { text: 'Pastas o Pescado 🍝', value: 'pastas_pescado', icon: '🍝' },
          { text: 'Quesos y Postres 🧀', value: 'quesos_postres', icon: '🧀' }
        ]
      }
    ]
  },
  perfumes: {
    category: 'perfumes',
    title: 'Encontrá tu Fragancia Signature',
    welcome_text: 'Descubrí el perfume ideal que combina con tu personalidad, intensidad preferida y estilo de vida.',
    button_text: 'Descubrir Perfume ✨',
    accent_color: '#D4AF37',
    background_color: '#111111',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Qué intensidad preferís en tu fragancia?',
        tag_key: 'intensidad',
        options: [
          { text: 'Intensa y Amaderada 🔥', value: 'intensa', icon: '🔥' },
          { text: 'Fresca y Cítrica 🍋', value: 'fresca', icon: '🍋' },
          { text: 'Dulce y Floral 🌸', value: 'dulce', icon: '🌸' }
        ]
      },
      {
        text: '¿Para qué ocasión lo usarías principalmente?',
        tag_key: 'ocasion',
        options: [
          { text: 'Eventos Nocturnos o Citas 🌃', value: 'noche', icon: '🌃' },
          { text: 'Uso Diario u Oficina 👔', value: 'diario', icon: '👔' },
          { text: 'Fiestas y Aire Libre ☀️', value: 'fiesta', icon: '☀️' }
        ]
      }
    ]
  },
  chocolates: {
    category: 'chocolates',
    title: 'Tu Chocolate Perfecto',
    welcome_text: 'Contestá estas breves preguntas y te diremos exactamente cuál es tu chocolate o trufa ideal para hoy.',
    button_text: 'Tentarme 🍫',
    accent_color: '#8C6239',
    background_color: '#2F1F17',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Cómo preferís el porcentaje de cacao?',
        tag_key: 'cacao',
        options: [
          { text: 'Amargo (70% - 90%) 🍫', value: 'amargo', icon: '🍫' },
          { text: 'Con Leche o Suave 🥛', value: 'leche', icon: '🥛' },
          { text: 'Blanco y Cremoso 🍦', value: 'blanco', icon: '🍦' }
        ]
      },
      {
        text: '¿Te gustan los ingredientes adicionales?',
        tag_key: 'adicional',
        options: [
          { text: 'Frutos Secos 🥜', value: 'frutos', icon: '🥜' },
          { text: 'Dulce de Leche o Relleno 🍯', value: 'relleno', icon: '🍯' },
          { text: 'Puro, sin agregados 🌱', value: 'puro', icon: '🌱' }
        ]
      }
    ]
  },
  ropa: {
    category: 'ropa',
    title: 'Encontrá tu Outfit Ideal',
    welcome_text: '¿No sabés qué ponerte? Nuestro asesor virtual de moda elegirá el atuendo perfecto según tu estilo.',
    button_text: 'Vestirme 👕',
    accent_color: '#3B5998',
    background_color: '#1A2536',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Cuál es tu estilo preferido?',
        tag_key: 'estilo',
        options: [
          { text: 'Elegante y Formal 👔', value: 'elegante', icon: '👔' },
          { text: 'Casual y Relajado 👕', value: 'casual', icon: '👕' },
          { text: 'Urbano y Deportivo 👟', value: 'urbano', icon: '👟' }
        ]
      },
      {
        text: '¿Para qué clima estás buscando?',
        tag_key: 'clima',
        options: [
          { text: 'Clima Frío ❄️', value: 'frio', icon: '❄️' },
          { text: 'Clima Cálido ☀️', value: 'calido', icon: '☀️' }
        ]
      }
    ]
  },
  cafe: {
    category: 'cafe',
    title: 'Elegí tu Variedad de Café',
    welcome_text: 'Contanos tus gustos y el método de preparación que usás para recomendarte el grano de café de especialidad perfecto.',
    button_text: 'Moler Café ☕',
    accent_color: '#5C4033',
    background_color: '#1C130E',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Qué tipo de tostado te gusta más?',
        tag_key: 'tostado',
        options: [
          { text: 'Oscuro y Fuerte ☕', value: 'oscuro', icon: '☕' },
          { text: 'Medio y Equilibrado 🌱', value: 'medio', icon: '🌱' },
          { text: 'Claro y Frutal 🍋', value: 'claro', icon: '🍋' }
        ]
      },
      {
        text: '¿Cómo lo preparás habitualmente?',
        tag_key: 'preparacion',
        options: [
          { text: 'Espresso 🇮🇹', value: 'espresso', icon: '🇮🇹' },
          { text: 'Prensa Francesa / Filtrado 💧', value: 'filtrado', icon: '💧' },
          { text: 'Con Leche / Capuccino 🥛', value: 'con_leche', icon: '🥛' }
        ]
      }
    ]
  },
  comidas: {
    category: 'comidas',
    title: '¿Qué vas a comer hoy? 🍽️',
    welcome_text: 'Respondé estas preguntas y nuestro asistente gourmet te recomendará el plato ideal según tus gustos y restricciones.',
    button_text: 'Elegir Menú 🍕',
    accent_color: '#E67E22',
    background_color: '#1A1412',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿Tenés alguna restricción alimentaria?',
        tag_key: 'dieta',
        options: [
          { text: 'Vegana 🌱', value: 'vegana', icon: '🌱' },
          { text: 'Sin Gluten 🌾', value: 'sin_gluten', icon: '🌾' },
          { text: 'Sin restricciones 🍔', value: 'todo', icon: '🍔' }
        ]
      },
      {
        text: '¿Qué tipo de plato preferís hoy?',
        tag_key: 'tipo_plato',
        options: [
          { text: 'Plato Caliente 🍲', value: 'caliente', icon: '🍲' },
          { text: 'Ensalada / Ligero 🥗', value: 'ligero', icon: '🥗' },
          { text: 'Algo Dulce / Postre 🍰', value: 'dulce', icon: '🍰' }
        ]
      }
    ]
  },
  generico: {
    category: 'generico',
    title: 'Encontrá tu Producto Ideal 🎁',
    welcome_text: 'Respondé un par de preguntas y descubrí cuál es la mejor opción disponible para tus necesidades.',
    button_text: 'Descubrir 🚀',
    accent_color: '#9B59B6',
    background_color: '#18141F',
    text_color: '#ffffff',
    questions: [
      {
        text: '¿En qué ocasión vas a usar el producto?',
        tag_key: 'uso',
        options: [
          { text: 'Trabajo / Estudio 💼', value: 'trabajo', icon: '💼' },
          { text: 'Uso Diario / Ocio 🎮', value: 'ocio', icon: '🎮' }
        ]
      },
      {
        text: '¿Cuál es tu principal prioridad?',
        tag_key: 'prioridad',
        options: [
          { text: 'Calidad Premium ⭐', value: 'premium', icon: '⭐' },
          { text: 'Precio / Oferta 🏷️', value: 'precio', icon: '🏷️' }
        ]
      }
    ]
  }
};

const PRESET_PALETTES = [
  { name: '🍷 Cabernet', accent: '#722F37', bg: '#1A1112', text: '#ffffff' },
  { name: '✨ Gold', accent: '#D4AF37', bg: '#111111', text: '#ffffff' },
  { name: '🍫 Sweet Cocoa', accent: '#8C6239', bg: '#2F1F17', text: '#ffffff' },
  { name: '👕 Denim Blue', accent: '#3B5998', bg: '#1A2536', text: '#ffffff' },
  { name: '☕ Espresso', accent: '#5C4033', bg: '#1C130E', text: '#ffffff' },
  { name: '🍕 Gourmet', accent: '#E67E22', bg: '#1A1412', text: '#ffffff' },
  { name: '🚀 Tech', accent: '#9B59B6', bg: '#18141F', text: '#ffffff' }
];

const Playground = () => {
  const [selectedCat, setSelectedCat] = useState('vinos');
  const [title, setTitle] = useState(CATEGORY_TEMPLATES.vinos.title);
  const [welcomeText, setWelcomeText] = useState(CATEGORY_TEMPLATES.vinos.welcome_text);
  const [buttonText, setButtonText] = useState(CATEGORY_TEMPLATES.vinos.button_text);
  const [accentColor, setAccentColor] = useState(CATEGORY_TEMPLATES.vinos.accent_color);
  const [backgroundColor, setBackgroundColor] = useState(CATEGORY_TEMPLATES.vinos.background_color);
  const [textColor, setTextColor] = useState(CATEGORY_TEMPLATES.vinos.text_color);
  const [questions, setQuestions] = useState(CATEGORY_TEMPLATES.vinos.questions);
  
  // Preview mode toggle states
  const [previewMode, setPreviewMode] = useState('phone'); // 'phone' or 'web'
  const [isWebWidgetOpen, setIsWebWidgetOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);
  const [widgetKey, setWidgetKey] = useState(0); // Used to reload the widget on template change

  // Sync state values when category changes
  const handleCategoryChange = (catKey) => {
    setSelectedCat(catKey);
    const template = CATEGORY_TEMPLATES[catKey];
    setTitle(template.title);
    setWelcomeText(template.welcome_text);
    setButtonText(template.button_text);
    setAccentColor(template.accent_color);
    setBackgroundColor(template.background_color);
    setTextColor(template.text_color);
    setQuestions(template.questions);
    setWidgetKey(prev => prev + 1); // Reset widget workflow state
    setIsWebWidgetOpen(false);
  };

  const handlePresetSelect = (preset) => {
    setAccentColor(preset.accent);
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
  };

  const handleAddToCartSimulated = (product) => {
    setNotification(`🛒 ¡Producto agregado! "${product.name}" de prueba fue sumado al carrito.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetWidget = () => {
    setWidgetKey(prev => prev + 1);
  };

  // Question Builder Handlers
  const handleAddQuestion = () => {
    const newQuestions = [...questions, {
      text: '¿Nueva Pregunta?',
      tag_key: `pregunta_${questions.length + 1}`,
      options: [
        { text: 'Opción A', value: 'opcion_a', icon: '⭐' },
        { text: 'Opción B', value: 'opcion_b', icon: '✨' }
      ]
    }];
    setQuestions(newQuestions);
    setWidgetKey(prev => prev + 1);
  };

  const handleRemoveQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions);
    setWidgetKey(prev => prev + 1);
  };

  const handleUpdateQuestion = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      [field]: value
    };
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[qIndex].options, { text: 'Nueva Opción', value: 'nueva_opcion', icon: '❓' }];
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      options: updatedOptions
    };
    setQuestions(newQuestions);
    setWidgetKey(prev => prev + 1);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[qIndex].options];
    updatedOptions.splice(optIndex, 1);
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      options: updatedOptions
    };
    setQuestions(newQuestions);
    setWidgetKey(prev => prev + 1);
  };

  const handleUpdateOption = (qIndex, optIndex, field, value) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[qIndex].options];
    updatedOptions[optIndex] = {
      ...updatedOptions[optIndex],
      [field]: value
    };
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      options: updatedOptions
    };
    setQuestions(newQuestions);
  };

  const previewConfig = {
    category: selectedCat,
    title,
    welcome_text: welcomeText,
    theme: {
      accent_color: accentColor,
      background_color: backgroundColor,
      text_color: textColor,
      button_text: buttonText
    },
    questions: questions
  };

  return (
    <div className="playground-page">
      {/* Dynamic Background Effects */}
      <div className="playground-bg-glow glow-1" style={{ backgroundColor: accentColor }}></div>
      <div className="playground-bg-glow glow-2" style={{ backgroundColor: backgroundColor }}></div>

      {/* Header */}
      <header className="playground-header">
        <div className="header-logo-container">
          <span className="header-logo">💡</span>
          <div>
            <h1>Smart Shopping Assistant</h1>
            <p>Demo & Customization Playground</p>
          </div>
        </div>
        
        <div className="header-actions">
          <a href="/?store_id=9999999" className="dashboard-pill-link">
            <span>⚙️ Panel Administrativo</span>
          </a>
        </div>
      </header>

      {/* Content Grid */}
      <main className="playground-grid">
        {/* Left Side: Customizer Panel */}
        <section className="playground-panel">
          <div className="panel-section">
            <h2>1. Selecciona una Categoría</h2>
            <p className="section-desc">Elegí un rubro para cargar plantillas de preguntas y productos adaptados.</p>
            
            <div className="category-selector-tabs">
              <button 
                className={`category-tab-btn ${selectedCat === 'vinos' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('vinos')}
              >
                <span className="tab-emoji">🍷</span>
                <span className="tab-text">Vinos</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'perfumes' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('perfumes')}
              >
                <span className="tab-emoji">✨</span>
                <span className="tab-text">Perfumes</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'chocolates' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('chocolates')}
              >
                <span className="tab-emoji">🍫</span>
                <span className="tab-text">Chocolates</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'ropa' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('ropa')}
              >
                <span className="tab-emoji">👕</span>
                <span className="tab-text">Moda</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'cafe' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('cafe')}
              >
                <span className="tab-emoji">☕</span>
                <span className="tab-text">Café</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'comidas' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('comidas')}
              >
                <span className="tab-emoji">🍕</span>
                <span className="tab-text">Comidas</span>
              </button>
              <button 
                className={`category-tab-btn ${selectedCat === 'generico' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('generico')}
              >
                <span className="tab-emoji">🎁</span>
                <span className="tab-text">Genérico</span>
              </button>
            </div>
          </div>

          <div className="panel-section">
            <h2>2. Personaliza el Contenido</h2>
            
            <div className="input-group">
              <label htmlFor="playground-title-input">Título de Bienvenida</label>
              <input 
                id="playground-title-input"
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                maxLength={60}
              />
            </div>

            <div className="input-group">
              <label htmlFor="playground-welcome-textarea">Descripción e Instrucciones</label>
              <textarea 
                id="playground-welcome-textarea"
                rows={3} 
                value={welcomeText} 
                onChange={(e) => setWelcomeText(e.target.value)}
                maxLength={180}
              />
            </div>

            <div className="input-group">
              <label htmlFor="playground-button-input">Texto del Botón Principal</label>
              <input 
                id="playground-button-input"
                type="text" 
                value={buttonText} 
                onChange={(e) => setButtonText(e.target.value)}
                maxLength={25}
              />
            </div>
          </div>

          <div className="panel-section">
            <h2>3. Diseño & Colores</h2>
            
            <div className="preset-palettes-container">
              <span className="presets-label">Paletas de Muestra:</span>
              <div className="preset-palettes-grid">
                {PRESET_PALETTES.map((preset, idx) => (
                  <button 
                    key={idx}
                    className="preset-btn"
                    onClick={() => handlePresetSelect(preset)}
                    title={preset.name}
                  >
                    <span className="preset-color-dot" style={{ backgroundColor: preset.accent }}></span>
                    <span className="preset-color-dot" style={{ backgroundColor: preset.bg }}></span>
                    <span className="preset-name">{preset.name.split(' ')[1] || preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="color-pickers-row">
              <div className="color-picker-input">
                <label htmlFor="playground-accent-picker">Acento</label>
                <div className="picker-wrapper">
                  <input 
                    id="playground-accent-picker"
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                  <code>{accentColor.toUpperCase()}</code>
                </div>
              </div>

              <div className="color-picker-input">
                <label htmlFor="playground-bg-picker">Fondo</label>
                <div className="picker-wrapper">
                  <input 
                    id="playground-bg-picker"
                    type="color" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                  <code>{backgroundColor.toUpperCase()}</code>
                </div>
              </div>

              <div className="color-picker-input">
                <label htmlFor="playground-text-picker">Texto</label>
                <div className="picker-wrapper">
                  <input 
                    id="playground-text-picker"
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                  <code>{textColor.toUpperCase()}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h2>4. Personalizar Preguntas</h2>
            <p className="section-desc">Editá las preguntas, agregá opciones, emoticones y tags de valor.</p>
            
            <div className="questions-builder-container">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="question-build-card">
                  <div className="question-build-header">
                    <span className="q-badge">Pregunta {qIdx + 1}</span>
                    <button 
                      className="delete-q-btn" 
                      onClick={() => handleRemoveQuestion(qIdx)}
                      title="Eliminar pregunta"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="input-group">
                    <label>Texto de la Pregunta</label>
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={(e) => handleUpdateQuestion(qIdx, 'text', e.target.value)} 
                    />
                  </div>

                  <div className="input-group">
                    <label>Tag Interno (Propiedad)</label>
                    <input 
                      type="text" 
                      value={q.tag_key || ''} 
                      onChange={(e) => handleUpdateQuestion(qIdx, 'tag_key', e.target.value)} 
                      placeholder="ej: tipo, dieta, uso"
                    />
                  </div>

                  <div className="options-builder-list">
                    <label className="options-title-label">Opciones de Respuesta:</label>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="option-build-row">
                        <input 
                          type="text" 
                          className="opt-icon-input" 
                          value={opt.icon || ''} 
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, 'icon', e.target.value)}
                          placeholder="🎨 Icon"
                          title="Emoji o ícono (ej. 🍕 o :-D)"
                        />
                        <input 
                          type="text" 
                          className="opt-text-input" 
                          value={opt.text || ''} 
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, 'text', e.target.value)}
                          placeholder="Texto de la opción"
                          title="Texto visible"
                        />
                        <input 
                          type="text" 
                          className="opt-val-input" 
                          value={opt.value || ''} 
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, 'value', e.target.value)}
                          placeholder="Valor tag"
                          title="Valor interno de tag"
                        />
                        <button 
                          className="delete-opt-btn" 
                          onClick={() => handleRemoveOption(qIdx, optIdx)}
                          title="Eliminar opción"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <button className="add-opt-btn" onClick={() => handleAddOption(qIdx)}>
                      + Agregar Opción
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="add-q-btn" onClick={handleAddQuestion}>
                + Agregar Nueva Pregunta
              </button>
            </div>
          </div>

          <div className="panel-footer">
            <button className="reset-demo-btn" onClick={handleResetWidget}>
              Reiniciar Simulación ↺
            </button>
          </div>
        </section>

        {/* Right Side: Smartphone / Web Mockup Simulator */}
        <section className="playground-preview">
          <div className="preview-sticky-container">
            {/* Visualizer Mode Selector */}
            <div className="preview-mode-selector">
              <button 
                className={`mode-selector-btn ${previewMode === 'phone' ? 'active' : ''}`}
                onClick={() => { setPreviewMode('phone'); handleResetWidget(); }}
              >
                📱 Vista Celular
              </button>
              <button 
                className={`mode-selector-btn ${previewMode === 'web' ? 'active' : ''}`}
                onClick={() => { setPreviewMode('web'); handleResetWidget(); setIsWebWidgetOpen(false); }}
              >
                💻 Ver Demo en Web (Integrado)
              </button>
            </div>

            {previewMode === 'phone' ? (
              /* Elegant Smartphone Wrapper */
              <div className="smartphone-mockup">
                {/* Top Details (Dynamic island / Speaker) */}
                <div className="smartphone-island">
                  <div className="island-camera"></div>
                  <div className="island-speaker"></div>
                </div>
                
                {/* Screen Area */}
                <div className="smartphone-screen">
                  <QuizWidget 
                    key={widgetKey}
                    isPlayground={true}
                    previewConfig={previewConfig}
                    onAddToCartSimulated={handleAddToCartSimulated}
                  />
                </div>

                {/* Bottom bar indicator */}
                <div className="smartphone-home-bar"></div>
              </div>
            ) : (
              /* High-fidelity Mock E-commerce Web Preview */
              <div className="web-demo-container">
                <div className="mock-web-page">
                  {/* Navbar */}
                  <nav className="mock-nav">
                    <span className="mock-brand">👜 MiTienda Demo</span>
                    <div className="mock-nav-links">
                      <span>Inicio</span>
                      <span>Colección</span>
                      <span>Nosotros</span>
                    </div>
                    <div className="mock-cart-icon">🛒 <span className="cart-badge">0</span></div>
                  </nav>

                  {/* Hero banner */}
                  <div className="mock-hero" style={{ background: `linear-gradient(135deg, ${accentColor}1A, ${backgroundColor}ee)` }}>
                    <h2>Novedades de la Temporada</h2>
                    <p>Respondé unas breves preguntas a nuestro asistente virtual y conseguí tu recomendación personalizada al instante.</p>
                  </div>

                  {/* Products Grid */}
                  <div className="mock-products-grid">
                    <div className="mock-prod-card">
                      <div className="mock-prod-img-placeholder">🎒</div>
                      <div className="mock-prod-title">Mochila Confort</div>
                      <div className="mock-prod-price">$14.500</div>
                    </div>
                    <div className="mock-prod-card">
                      <div className="mock-prod-img-placeholder">🍷</div>
                      <div className="mock-prod-title">Gran Tinto Reserva</div>
                      <div className="mock-prod-price">$8.500</div>
                    </div>
                    <div className="mock-prod-card">
                      <div className="mock-prod-img-placeholder">✨</div>
                      <div className="mock-prod-title">Fragancia Esencial</div>
                      <div className="mock-prod-price">$15.500</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className="mock-footer">
                    © 2026 MiTienda S.A. - Smart Assistant integrado con éxito.
                  </footer>

                  {/* Launcher Button (Widget Trigger) */}
                  <div 
                    className="floating-widget-launcher"
                    style={{ backgroundColor: accentColor, color: '#ffffff' }}
                    onClick={() => setIsWebWidgetOpen(!isWebWidgetOpen)}
                  >
                    <span className="launcher-icon">💡</span>
                    <span className="launcher-text">¿Necesitás ayuda?</span>
                  </div>

                  {/* Expanded Chat Widget Container */}
                  {isWebWidgetOpen && (
                    <div className="widget-popup-container fade-in-up">
                      <div className="widget-popup-header" style={{ backgroundColor: accentColor }}>
                        <span>Asistente de Compra Inteligente</span>
                        <button className="close-popup-btn" onClick={() => setIsWebWidgetOpen(false)}>✕</button>
                      </div>
                      <div className="widget-popup-body">
                        <QuizWidget 
                          key={widgetKey}
                          isPlayground={true}
                          previewConfig={previewConfig}
                          onAddToCartSimulated={handleAddToCartSimulated}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Helpful Badges */}
            <div className="preview-badges">
              <div className="p-badge">
                <span className="badge-icon">⚡</span>
                <span className="badge-title">React Direct-Sync</span>
                <span className="badge-desc">Edición viva y en tiempo real</span>
              </div>
              <div className="p-badge">
                <span className="badge-icon">🛡️</span>
                <span className="badge-title">Sandbox Local</span>
                <span className="badge-desc">Cálculo de recomendación 100% offline</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simulated purchase Toast Notification */}
      {notification && (
        <div className="playground-toast fade-in-up">
          <span className="toast-icon">🛍️</span>
          <p className="toast-text">{notification}</p>
        </div>
      )}
    </div>
  );
};

export default Playground;
