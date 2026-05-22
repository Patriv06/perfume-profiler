import React, { useState, useEffect, useRef } from 'react';
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

const Dashboard = ({ storeId }) => {
  const [config, setConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleNode = (nodeId) => {
    setCollapsedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Form states
  const [category, setCategory] = useState('vinos');
  const [title, setTitle] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [accentColor, setAccentColor] = useState('#722F37');
  const [backgroundColor, setBackgroundColor] = useState('#1A1112');
  const [textColor, setTextColor] = useState('#ffffff');
  const [buttonText, setButtonText] = useState('Comenzar');
  const [questions, setQuestions] = useState([]);
  const [logoImg, setLogoImg] = useState('');
  const [billingStatus, setBillingStatus] = useState('active');

  const previewIframeRef = useRef(null);
  const API_URL = getApiUrl();

  // Load configs and products
  useEffect(() => {
    if (!storeId) return;

    fetchConfig();
    fetchProducts();
  }, [storeId]);

  const fetchConfig = () => {
    setLoadingConfig(true);
    axios.get(`${API_URL}/api/admin/config?store_id=${storeId}`)
      .then(res => {
        const data = res.data;
        setConfig(data);
        
        // Check if there is a category override in URL (useful when clicking from Playground)
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        const activeCategory = categoryParam && ['vinos', 'perfumes', 'chocolates', 'ropa', 'cafe', 'comidas', 'generico'].includes(categoryParam) 
          ? categoryParam 
          : data.category;
          
        setCategory(activeCategory);
        
        // If the category in the database is different from the override, save it
        if (categoryParam && categoryParam !== data.category && ['vinos', 'perfumes', 'chocolates', 'ropa', 'cafe', 'comidas', 'generico'].includes(categoryParam)) {
          axios.post(`${API_URL}/api/admin/config?store_id=${storeId}`, {
            category: categoryParam
          }).then(postRes => {
            // Clean up the URL to prevent infinite loop or re-saving
            const newUrl = window.location.pathname + `?store_id=${storeId}`;
            window.history.replaceState({}, '', newUrl);
            
            // Re-fetch config and products to reflect the newly seeded database state
            axios.get(`${API_URL}/api/admin/config?store_id=${storeId}`)
              .then(cfgRes => {
                const refreshedData = cfgRes.data;
                setConfig(refreshedData);
                setCategory(refreshedData.category);
                setTitle(refreshedData.quiz_config.title || '');
                setWelcomeText(refreshedData.quiz_config.welcome_text || '');
                setAccentColor(refreshedData.quiz_config.accent_color || '#722F37');
                setBackgroundColor(refreshedData.quiz_config.background_color || '#1A1112');
                setTextColor(refreshedData.quiz_config.text_color || '#ffffff');
                setButtonText(refreshedData.quiz_config.button_text || 'Comenzar');
                setQuestions(refreshedData.quiz_config.questions || []);
                setLogoImg(refreshedData.quiz_config.logo_img || '');
                setBillingStatus(refreshedData.billing_status || 'active');
                
                // Refresh products in the list
                fetchProducts();
              });
          }).catch(err => console.error("Error setting category from url:", err));
        } else {
          setTitle(data.quiz_config.title || '');
          setWelcomeText(data.quiz_config.welcome_text || '');
          setAccentColor(data.quiz_config.accent_color || '#722F37');
          setBackgroundColor(data.quiz_config.background_color || '#1A1112');
          setTextColor(data.quiz_config.text_color || '#ffffff');
          setButtonText(data.quiz_config.button_text || 'Comenzar');
          setQuestions(data.quiz_config.questions || []);
          setLogoImg(data.quiz_config.logo_img || '');
          setBillingStatus(data.billing_status || 'active');
        }
        
        setLoadingConfig(false);
      })
      .catch(err => {
        console.error('Error fetching admin config:', err);
        setLoadingConfig(false);
      });
  };

  const fetchProducts = () => {
    setLoadingProducts(true);
    axios.get(`${API_URL}/api/admin/products?store_id=${storeId}`)
      .then(res => {
        setProducts(res.data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoadingProducts(false);
      });
  };

  const handleSaveConfig = (e) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    setSaveMessage('');

    axios.post(`${API_URL}/api/admin/config?store_id=${storeId}`, {
      category,
      quiz_config: {
        title,
        welcome_text: welcomeText,
        accent_color: accentColor,
        background_color: backgroundColor,
        text_color: textColor,
        button_text: buttonText,
        questions,
        logo_img: logoImg
      }
    })
      .then(res => {
        setSaveMessage('✓ ¡Configuración guardada con éxito!');
        // Update local state if category changed (resets template)
        if (res.data.category !== config.category) {
          fetchConfig();
        }
        // Reload iframe preview
        if (previewIframeRef.current) {
          previewIframeRef.current.src = previewIframeRef.current.src;
        }
        setTimeout(() => setSaveMessage(''), 4000);
      })
      .catch(err => {
        console.error('Error saving config:', err);
        setSaveMessage('❌ Error al guardar la configuración.');
      })
      .finally(() => {
        setSavingConfig(false);
      });
  };

  const handleToggleBilling = () => {
    const newStatus = billingStatus === 'active' ? 'inactive' : 'active';
    axios.post(`${API_URL}/api/admin/billing/toggle?store_id=${storeId}`, { billing_status: newStatus })
      .then(res => {
        setBillingStatus(newStatus);
        // reload iframe preview
        if (previewIframeRef.current) {
          previewIframeRef.current.src = previewIframeRef.current.src;
        }
      })
      .catch(err => {
        console.error('Error toggling billing:', err);
        alert('Error al simular cambio de estado de facturación.');
      });
  };

  const handleSyncProducts = () => {
    setSyncing(true);
    axios.post(`${API_URL}/api/admin/products/sync?store_id=${storeId}`)
      .then(res => {
        alert(res.data.message || 'Sincronización finalizada.');
        fetchProducts();
      })
      .catch(err => {
        console.error('Sync error:', err);
        alert(err.response?.data?.error ? `${err.response.data.error}: ${err.response.data.message}` : 'Error al sincronizar productos. La tienda de demostración utiliza credenciales simuladas.');
      })
      .finally(() => {
        setSyncing(false);
      });
  };

  // Question Builder Handlers
  const handleAddQuestion = () => {
    if (questions.length >= 3) {
      setUpgradeReason('has superado el límite de 3 preguntas configuradas de la versión de prueba gratuita.');
      setShowUpgradeModal(true);
      return;
    }
    
    const newQuestions = [...questions, {
      text: '¿Nueva Pregunta?',
      tag_key: `pregunta_${questions.length + 1}`,
      options: [
        { text: 'Opción A', value: 'opcion_a', icon: '⭐' },
        { text: 'Opción B', value: 'opcion_b', icon: '✨' }
      ]
    }];
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions);
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

  const handleUploadOptionImage = (qIdx, optIdx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleUpdateOption(qIdx, optIdx, 'icon', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreview = () => {
    if (previewIframeRef.current && previewIframeRef.current.contentWindow) {
      previewIframeRef.current.contentWindow.postMessage({
        action: 'smart_assistant_preview_config',
        config: {
          category,
          title,
          welcome_text: welcomeText,
          theme: {
            accent_color: accentColor,
            background_color: backgroundColor,
            text_color: textColor,
            button_text: buttonText
          },
          questions,
          logo_img: logoImg
        }
      }, '*');
    }
  };

  // Open Tag Editor Modal for a product
  const startEditingTags = (product) => {
    const isAlreadyTagged = product.tags && product.tags.length > 0;
    const taggedCount = products.filter(p => p.tags && p.tags.length > 0).length;
    
    if (!isAlreadyTagged && taggedCount >= 10) {
      setUpgradeReason('has alcanzado el límite de 10 productos etiquetados en la versión de prueba gratuita.');
      setShowUpgradeModal(true);
      return;
    }

    // Clone tags so we can modify locally
    const productTags = product.tags ? [...product.tags] : [];
    
    // Set dynamic tags layout depending on active questions list
    const initialTagState = {};
    questions.forEach(q => {
      const key = q.tag_key;
      if (!key) return;
      initialTagState[key] = productTags.filter(t => t.key === key).map(t => t.value);
    });

    setEditingProduct({
      ...product,
      editedTags: initialTagState
    });
  };

  const handleTagValueChange = (key, value) => {
    if (!editingProduct) return;

    let updatedEditedTags = { ...editingProduct.editedTags };
    const currentValues = updatedEditedTags[key] || [];

    if (currentValues.includes(value)) {
      updatedEditedTags[key] = currentValues.filter(val => val !== value);
    } else {
      updatedEditedTags[key] = [...currentValues, value];
    }

    setEditingProduct({
      ...editingProduct,
      editedTags: updatedEditedTags
    });
  };

  const handleSaveTags = () => {
    if (!editingProduct) return;

    const formattedTags = [];
    const et = editingProduct.editedTags;

    Object.keys(et).forEach(key => {
      const vals = et[key];
      if (Array.isArray(vals)) {
        vals.forEach(v => {
          if (v) formattedTags.push({ key, value: v });
        });
      }
    });

    axios.post(`${API_URL}/api/admin/products/tags?store_id=${storeId}`, {
      product_id: editingProduct.id,
      tags: formattedTags
    })
      .then(() => {
        setEditingProduct(null);
        fetchProducts();
      })
      .catch(err => {
        console.error('Error saving tags:', err);
        alert('Error al guardar las etiquetas.');
      });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const buildDashboardTree = () => {
    const treeNodes = [];
    
    questions.forEach(q => {
      const keyNode = {
        label: `📁 Filtro: ${q.text} (${q.tag_key})`,
        key: q.tag_key,
        children: []
      };
      
      if (q.options && Array.isArray(q.options)) {
        q.options.forEach(opt => {
          const matchingProducts = products.filter(p => 
            p.tags && p.tags.some(t => t.key === q.tag_key && t.value === opt.value)
          );
          
          keyNode.children.push({
            label: `🏷️ Valor: "${opt.text}" (Coincidencia: "${opt.value}")`,
            key: `${q.tag_key}-${opt.value}`,
            products: matchingProducts
          });
        });
        
        // Unassigned values check
        const optionValues = q.options.map(o => o.value);
        const unassignedProducts = products.filter(p => {
          if (!p.tags) return false;
          const matchingTags = p.tags.filter(t => t.key === q.tag_key);
          return matchingTags.some(t => !optionValues.includes(t.value));
        });
        
        if (unassignedProducts.length > 0) {
          keyNode.children.push({
            label: `⚠️ Con otros valores en tu tienda`,
            key: `${q.tag_key}-other`,
            products: unassignedProducts
          });
        }
      }
      
      treeNodes.push(keyNode);
    });
    
    // Unclassified products in Dashboard
    const allKeys = questions.map(q => q.tag_key);
    const unclassified = products.filter(p => {
      return !p.tags || !p.tags.some(t => allKeys.includes(t.key));
    });
    
    if (unclassified.length > 0) {
      treeNodes.push({
        label: `📁 Sin etiquetas configuradas`,
        key: 'unclassified',
        isUnclassified: true,
        products: unclassified
      });
    }
    
    return treeNodes;
  };

  if (loadingConfig) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  // Preview link to feed the iframe
  const previewUrl = `${window.location.origin}${window.location.pathname}?view=widget&store_id=${storeId}`;

  return (
    <div className="admin-dashboard-container">
      {/* Top Header */}
      <header className="admin-header">
        <div className="header-brand-section">
          <span className="brand-logo">💡</span>
          <div>
            <h1 className="brand-title">Smart Shopping Assistant</h1>
            <p className="brand-subtitle">Panel de Control General • Multi-Tenant SaaS</p>
          </div>
        </div>

        <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#f8fafc', fontWeight: '500' }}>
            🎮 Volver al Playground
          </a>
          
          <button 
            onClick={handleToggleBilling} 
            className={`billing-toggle-pill ${billingStatus === 'active' ? 'active' : 'inactive'}`}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: billingStatus === 'active' ? '#10b981' : '#ef4444',
              color: '#ffffff',
              transition: 'background-color 0.2s ease'
            }}
          >
            {billingStatus === 'active' ? (
              <>💳 Suscripción: Activa</>
            ) : (
              <>⚠️ Suscripción: Inactiva</>
            )}
          </button>

          {config && (
            <div className="store-badge-card" style={{ margin: 0 }}>
              <span className="store-status-dot" style={{ backgroundColor: billingStatus === 'active' ? '#10b981' : '#ef4444' }}></span>
              <div>
                <div className="store-name">{config.store_name}</div>
                <a href={config.store_url} target="_blank" rel="noopener noreferrer" className="store-url">
                  {config.store_url.replace(/https?:\/\//, '')} ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Warning Banner when Billing is Inactive */}
      {billingStatus === 'inactive' && (
        <div className="billing-warning-banner" style={{ background: '#ef4444', color: '#ffffff', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span>
              <strong>Suscripción Inactiva por Falta de Pago:</strong> El asistente de compras está actualmente desactivado en el storefront de tus clientes. Los compradores no podrán ver ni interactuar con el recomendador.
            </span>
          </div>
          <button 
            type="button" 
            onClick={handleToggleBilling} 
            style={{ background: '#ffffff', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}
          >
            Activar Suscripción
          </button>
        </div>
      )}

      {/* Quick Navigation Bar */}
      <nav className="admin-quick-nav">
        <div className="quick-nav-container">
          <span className="quick-nav-title">Acceso Rápido:</span>
          <div className="quick-nav-links">
            <a href="#sec-config" className="quick-nav-link">⚙️ 1. Personalización</a>
            <a href="#sec-script" className="quick-nav-link">🔌 2. Integración</a>
            <a href="#sec-preview" className="quick-nav-link">📱 3. Simulador</a>
            <a href="#sec-products" className="quick-nav-link">📦 4. Matriz de Productos</a>
            <a href="#sec-tree" className="quick-nav-link">🌳 5. Árbol de Jerarquías</a>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="admin-main-grid">
        
        {/* Left Column: Config Forms */}
        <div className="grid-column-left">
          <div className="admin-card config-card" id="sec-config">
            {billingStatus === 'inactive' && (
              <div className="billing-lock-overlay">
                <div className="lock-content">
                  <span className="lock-icon">🔒</span>
                  <h3>Personalización Bloqueada</h3>
                  <p>Suscripción inactiva. Regularizá el pago para habilitar la personalización.</p>
                  <button type="button" className="btn-primary btn-sm" onClick={handleToggleBilling}>Activar Suscripción</button>
                </div>
              </div>
            )}
            <h2 className="card-title">⚙️ Personalización del Asistente</h2>
            
            <form onSubmit={handleSaveConfig} className="config-form">
              <div className="form-group">
                <label className="form-label">Categoría / Plantilla del Quiz</label>
                <select 
                  className="form-select"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="vinos">🍷 Vinos (Sommelier Virtual)</option>
                  <option value="perfumes">✨ Perfumes (Buscador de Fragancias)</option>
                  <option value="chocolates">🍫 Chocolates (Tu Chocolate Perfecto)</option>
                  <option value="ropa">👕 Ropa (Encontrá tu Outfit Ideal)</option>
                  <option value="cafe">☕ Café (Elegí tu Variedad de Café)</option>
                  <option value="comidas">🍽️ Comidas (¿Qué vas a comer hoy?)</option>
                  <option value="generico">🎁 Genérico (Encontrá tu Producto Ideal)</option>
                </select>
                <p className="form-help-text">
                  Al cambiar de categoría se cargarán automáticamente las preguntas específicas de ese rubro y se actualizarán los productos de demostración.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Logo del Asistente</label>
                <div className="logo-uploader-container" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  {logoImg ? (
                    <div className="logo-preview-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={logoImg} alt="Logo preview" className="admin-logo-preview" style={{ maxHeight: '50px', maxWidth: '100px', objectFit: 'contain', display: 'block', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '4px' }} />
                      <button type="button" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setLogoImg('')}>Quitar Logo</button>
                    </div>
                  ) : (
                    <div className="file-upload-wrapper">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="logo-file-input" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => setLogoImg(evt.target.result);
                            reader.readAsDataURL(file);
                          }
                        }} 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="logo-file-input" className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block', padding: '6px 12px', fontSize: '12px' }}>
                        🖼️ Subir Logo Imagen (Base64)
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Título del Asistente</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Encontrá tu Vino Ideal"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Texto de Bienvenida</label>
                <textarea 
                  className="form-textarea"
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  placeholder="Instrucciones breves para el comprador..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Texto del Botón de Inicio</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Ej: Comenzar"
                  required
                />
              </div>

              <div className="colors-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="form-group color-picker-group">
                  <label className="form-label">Color de Acento</label>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      className="form-color-picker"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="color-hex-text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      style={{ fontSize: '11px', padding: '6px 8px' }}
                    />
                  </div>
                </div>

                <div className="form-group color-picker-group">
                  <label className="form-label">Fondo</label>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      className="form-color-picker"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="color-hex-text" 
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      style={{ fontSize: '11px', padding: '6px 8px' }}
                    />
                  </div>
                </div>

                <div className="form-group color-picker-group">
                  <label className="form-label">Color de Texto</label>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      className="form-color-picker"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="color-hex-text" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{ fontSize: '11px', padding: '6px 8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Builder Section */}
              <div className="question-builder-section" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>❓ Cuestionario Inteligente</h3>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={handleAddQuestion}
                    style={{ fontSize: '11px', padding: '4px 8px', borderColor: 'var(--widget-accent)' }}
                  >
                    + Agregar Pregunta
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="builder-question-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--widget-accent)' }}>Pregunta {qIdx + 1} de {questions.length}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveQuestion(qIdx)}
                        style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Pregunta</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={q.text || ''} 
                        onChange={(e) => handleUpdateQuestion(qIdx, 'text', e.target.value)}
                        placeholder="Ej: ¿Qué sabor preferís?"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px' }}>Propiedad del Producto (tag_key)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={q.tag_key || ''} 
                        onChange={(e) => handleUpdateQuestion(qIdx, 'tag_key', e.target.value)}
                        placeholder="Ej: sabor"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        required
                      />
                    </div>

                    <div className="builder-options-container" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', opacity: 0.8 }}>Opciones</span>
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={() => handleAddOption(qIdx)}
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          + Opción
                        </button>
                      </div>

                      {q.options && q.options.map((opt, optIdx) => {
                        const isImgIcon = opt.icon && (opt.icon.startsWith('data:image') || opt.icon.startsWith('http') || opt.icon.startsWith('/'));
                        return (
                          <div key={optIdx} className="builder-option-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={opt.text || ''} 
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, 'text', e.target.value)}
                              placeholder="Texto"
                              style={{ padding: '6px 8px', fontSize: '12px' }}
                              required
                            />
                            <input 
                              type="text" 
                              className="form-input" 
                              value={opt.value || ''} 
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, 'value', e.target.value)}
                              placeholder="Valor"
                              style={{ padding: '6px 8px', fontSize: '12px' }}
                              required
                            />
                            <div className="icon-uploader-or-emoji" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {isImgIcon ? (
                                <div style={{ position: 'relative' }}>
                                  <img src={opt.icon} alt="icon preview" style={{ width: '20px', height: '20px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                                  <button 
                                    type="button" 
                                    onClick={() => handleUpdateOption(qIdx, optIdx, 'icon', '⭐')}
                                    style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '10px', height: '10px', fontSize: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={opt.icon || ''} 
                                  onChange={(e) => handleUpdateOption(qIdx, optIdx, 'icon', e.target.value)}
                                  placeholder="⭐"
                                  style={{ width: '32px', textAlign: 'center', padding: '6px 4px', fontSize: '12px' }}
                                />
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                id={`opt-file-${qIdx}-${optIdx}`} 
                                style={{ display: 'none' }}
                                onChange={(e) => handleUploadOptionImage(qIdx, optIdx, e.target.files[0])}
                              />
                              <label 
                                htmlFor={`opt-file-${qIdx}-${optIdx}`} 
                                className="btn-secondary" 
                                style={{ cursor: 'pointer', padding: '6px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                🖼️
                              </label>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveOption(qIdx, optIdx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
                            >
                              🗑️
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" disabled={savingConfig}>
                  {savingConfig ? 'Guardando...' : 'Guardar en BD'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleApplyPreview}
                  style={{ borderColor: 'var(--widget-accent)' }}
                >
                  Aplicar al Simulador 🚀
                </button>
                {saveMessage && <span className="save-feedback" style={{ fontSize: '13px' }}>{saveMessage}</span>}
              </div>
            </form>
          </div>

          {/* Script Integration Card */}
          <div className="admin-card script-card" id="sec-script">
            {billingStatus === 'inactive' && (
              <div className="billing-lock-overlay">
                <div className="lock-content">
                  <span className="lock-icon">🔒</span>
                  <h3>Integración Bloqueada</h3>
                  <p>Suscripción inactiva. Regularizá el pago para habilitar la integración.</p>
                  <button type="button" className="btn-primary btn-sm" onClick={handleToggleBilling}>Activar Suscripción</button>
                </div>
              </div>
            )}
            <h3 className="card-title">🔌 Código de Integración Manual</h3>
            <p className="card-info-text">
              El script se inyecta **automáticamente** al instalar la app. Si necesitás agregarlo a otra página o plantilla personalizada, insertá el siguiente código antes del cierre del body:
            </p>
            <pre className="code-block">
              <code>{`<script src="${API_URL}/widget.js?store=${storeId}"></script>`}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Live Simulator Preview */}
        <div className="grid-column-right">
          <div className="admin-card preview-card" id="sec-preview">
            <h2 className="card-title">📱 Simulador en Tiempo Real</h2>
            <p className="preview-subtitle">Probá el flujo y mirá cómo luce en un celular</p>
            
            <div className="smartphone-mockup">
              <div className="smartphone-screen">
                <iframe 
                  ref={previewIframeRef}
                  src={previewUrl}
                  title="Widget Live Preview"
                  className="preview-iframe"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Products Matrix and Tags Editor */}
      <section className="admin-products-section" id="sec-products">
        <div className="products-section-header">
          <div>
            <h2 className="section-title">📦 Matriz de Recomendación de Productos</h2>
            <p className="section-subtitle">
              Sincronizá tus artículos de Tiendanube y gestioná las etiquetas del recomendador.
            </p>
            <div className="trial-limit-tracker" style={{ marginTop: '14px' }}>
              <div className="tracker-info">
                <span>🏷️ Productos etiquetados: <strong>{products.filter(p => p.tags && p.tags.length > 0).length} / 10</strong></span>
                <span className="tracker-badge">Plan Gratuito</span>
              </div>
              <div className="tracker-bar-bg">
                <div 
                  className="tracker-bar-fill" 
                  style={{ 
                    width: `${Math.min((products.filter(p => p.tags && p.tags.length > 0).length / 10) * 100, 100)}%`, 
                    backgroundColor: products.filter(p => p.tags && p.tags.length > 0).length >= 10 ? '#ef4444' : '#D4AF37' 
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="section-actions">
            <button 
              className={`btn-sync ${syncing ? 'btn-sync-active' : ''}`}
              onClick={handleSyncProducts}
              disabled={syncing}
            >
              {syncing ? (
                <>Sincronizando...</>
              ) : (
                <>Sincronizar con Tiendanube ↻</>
              )}
            </button>
          </div>
        </div>

        <div className="recommendation-guide-banner">
          <div className="guide-banner-header" onClick={() => setShowGuide(!showGuide)} style={{ cursor: 'pointer' }}>
            <span>💡 Guía rápida: ¿Cómo aprende el asistente a recomendar tus productos?</span>
            <span className="toggle-guide-icon">{showGuide ? '▲ Colapsar' : '▼ Expandir'}</span>
          </div>
          {showGuide && (
            <div className="guide-banner-body">
              <p>
                El asistente utiliza un <strong>motor de puntuación cruzada</strong> para recomendar los productos de tu catálogo basándose en las respuestas:
              </p>
              <div className="guide-banner-steps">
                <div className="banner-step">
                  <span className="step-badge">1</span>
                  <div>
                    <strong>Propiedades de Pregunta:</strong> Cada pregunta evalúa un atributo o clave (ej. <code>sabor</code>, <code>dieta</code> o <code>gender</code>).
                  </div>
                </div>
                <div className="banner-step">
                  <span className="step-badge">2</span>
                  <div>
                    <strong>Valores de Respuestas:</strong> Cada respuesta representa un valor posible (ej. <code>tinto</code>, <code>vegana</code>, <code>Mujer</code>).
                  </div>
                </div>
                <div className="banner-step">
                  <span className="step-badge">3</span>
                  <div>
                    <strong>Etiquetas del Producto:</strong> En la tabla de abajo, hacé clic en <strong>"Editar Etiquetas 🏷️"</strong> y asignale las etiquetas clave-valor correspondientes a tus productos (ej. <code>sabor: tinto</code>).
                  </div>
                </div>
              </div>
              <div className="guide-banner-footer">
                📈 <strong>¿Cómo se decide el ganador?</strong> Cada respuesta que coincide con una etiqueta de producto suma <strong>+1 punto</strong> a ese producto. El producto que acumule el <strong>puntaje más alto</strong> al final de la trivia será el recomendado en pantalla.
              </div>
            </div>
          )}
        </div>

        <div className="admin-card table-card">
          {billingStatus === 'inactive' && (
            <div className="billing-lock-overlay">
              <div className="lock-content">
                <span className="lock-icon">🔒</span>
                <h3>Matriz de Productos Bloqueada</h3>
                <p>Suscripción inactiva. Regularizá el pago para gestionar etiquetas de recomendación.</p>
                <button type="button" className="btn-primary btn-sm" onClick={handleToggleBilling}>Activar Suscripción</button>
              </div>
            </div>
          )}
          <div className="table-filter-bar">
            <input 
              type="text"
              className="table-search-input"
              placeholder="Buscar productos por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loadingProducts ? (
            <div className="table-loading-container">
              <div className="admin-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-table-placeholder">
              <p>No se encontraron productos coincidentes en la base de datos.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Detalles del Producto</th>
                    <th>SKU</th>
                    <th>Precio</th>
                    <th>Etiquetas del Recomendador</th>
                    <th className="align-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td className="col-img">
                        <img 
                          src={p.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=100'} 
                          alt={p.name}
                          className="table-prod-img"
                        />
                      </td>
                      <td className="col-details">
                        <div className="table-prod-name">{p.name}</div>
                        <div className="table-prod-desc-trim">{p.description}</div>
                      </td>
                      <td className="col-sku"><code>{p.sku || '-'}</code></td>
                      <td className="col-price">${parseFloat(p.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                      <td className="col-tags">
                        <div className="tags-container">
                          {p.tags && p.tags.length > 0 ? (
                            p.tags.map((t, idx) => (
                              <span key={idx} className={`tag-chip tag-key-${t.key}`}>
                                <strong>{t.key}:</strong> {t.value}
                              </span>
                            ))
                          ) : (
                            <span className="no-tags-badge">Sin etiquetas asignadas</span>
                          )}
                        </div>
                      </td>
                      <td className="col-actions align-right">
                        <button className="btn-table-action" onClick={() => startEditingTags(p)}>
                          Editar Etiquetas 🏷️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Modal Editor de Etiquetas */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Editar Etiquetas: {editingProduct.name}</h3>
              <button className="btn-modal-close" onClick={() => setEditingProduct(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-intro-text">
                Asigná etiquetas específicas a este producto para que el recomendador inteligente lo sugiera cuando coincida con las respuestas del comprador.
              </p>

              <div className="modal-tag-selectors">
                {questions.map((q) => (
                  <div className="tag-selector-group" key={q.tag_key}>
                    <label className="tag-label">{q.text} (<code>{q.tag_key}</code>)</label>
                    <div className="tag-checkbox-options">
                      {q.options && q.options.map((opt) => (
                        <label key={opt.value} className="tag-checkbox-label">
                          <input
                            type="checkbox"
                            checked={(editingProduct.editedTags[q.tag_key] || []).includes(opt.value)}
                            onChange={() => handleTagValueChange(q.tag_key, opt.value)}
                          />
                          {opt.text} <span style={{ opacity: 0.5, fontSize: '11px' }}>({opt.value})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setEditingProduct(null)}>
                Cancelar
              </button>
              <button className="btn-modal-save" onClick={handleSaveTags}>
                Guardar Etiquetas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hierarchy Tree Section */}
      <section className="admin-tree-section" id="sec-tree" style={{ marginTop: '40px' }}>
        <div className="admin-card tree-card">
          <div className="tree-header">
            <h2 className="section-title">🌳 Árbol de Jerarquías de la Tienda</h2>
            <p className="section-subtitle">
              Visualizá la taxonomía de tus productos y su organización de recomendación.
            </p>
          </div>
          
          <div className="tree-root">
            <div className="tree-node root-node">
              <span className="tree-icon">🏪</span>
              <strong className="tree-label">{config ? config.store_name : 'Mi Tienda'} ({category.toUpperCase()})</strong>
            </div>
            
            <div className="tree-children">
              {buildDashboardTree().map((node) => {
                const isCollapsed = collapsedNodes[node.key];
                return (
                  <div key={node.key} className="tree-node-group">
                    <div 
                      className={`tree-node parent-node ${isCollapsed ? 'collapsed' : ''}`}
                      onClick={() => toggleNode(node.key)}
                    >
                      <span className="tree-icon">{isCollapsed ? '📁' : '📂'}</span>
                      <span className="tree-label">{node.label}</span>
                      <span className="toggle-arrow">{isCollapsed ? '▶' : '▼'}</span>
                    </div>
                    
                    {!isCollapsed && (
                      <div className="tree-children">
                        {node.isUnclassified ? (
                          node.products.map(p => (
                            <div key={p.id} className="tree-node leaf-node product-node">
                              <span className="tree-icon">📦</span>
                              <span className="tree-label">{p.name} <span className="tree-product-price">(${parseFloat(p.price).toLocaleString('es-AR')})</span></span>
                            </div>
                          ))
                        ) : (
                          node.children.map(child => {
                            const isChildCollapsed = collapsedNodes[child.key];
                            return (
                              <div key={child.key} className="tree-node-group sub-group">
                                <div 
                                  className={`tree-node child-node ${isChildCollapsed ? 'collapsed' : ''}`}
                                  onClick={() => toggleNode(child.key)}
                                >
                                  <span className="tree-icon">🏷️</span>
                                  <span className="tree-label">{child.label}</span>
                                  <span className="toggle-arrow">{isChildCollapsed ? '▶' : '▼'}</span>
                                  <span className="products-count-badge">{child.products.length} {child.products.length === 1 ? 'prod' : 'prods'}</span>
                                </div>
                                
                                {!isChildCollapsed && (
                                  <div className="tree-children">
                                    {child.products.length > 0 ? (
                                      child.products.map(p => (
                                        <div key={p.id} className="tree-node leaf-node product-node">
                                          <span className="tree-icon">📦</span>
                                          <span className="tree-label">{p.name} <span className="tree-product-price">(${parseFloat(p.price).toLocaleString('es-AR')})</span></span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="tree-node leaf-node empty-node">
                                        <span className="tree-icon">⚠️</span>
                                        <span className="tree-label text-muted">Ningún producto coincide con esta etiqueta</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Premium Upgrade */}
      {showUpgradeModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-card">
            <div className="premium-modal-glow"></div>
            <div className="premium-modal-header">
              <span className="premium-badge">👑 PLAN PRO</span>
              <button className="premium-close-btn" onClick={() => setShowUpgradeModal(false)}>✕</button>
            </div>
            <div className="premium-modal-body">
              <div className="premium-icon-glow">✨</div>
              <h2>¡Desbloqueá el Potencial Completo!</h2>
              <p className="premium-reason">
                Para garantizar un servicio óptimo, {upgradeReason}
              </p>
              <p className="premium-benefit-intro">
                El Plan PRO incluye:
              </p>
              <ul className="premium-benefits-list">
                <li>🚀 <strong>Preguntas ilimitadas</strong> para guiar mejor a tus compradores.</li>
                <li>🏷️ <strong>Productos etiquetados ilimitados</strong> en tu tienda real.</li>
                <li>📊 <strong>Métricas avanzadas</strong> de conversión y ventas.</li>
                <li>🎨 <strong>Diseño 100% personalizable</strong> sin marca de agua.</li>
              </ul>
              
              <button className="premium-upgrade-btn" onClick={() => {
                alert('¡Gracias por tu interés! En un entorno real, aquí se abriría el checkout de pago para suscribirte al plan PRO.');
                setShowUpgradeModal(false);
              }}>
                Mejorar a Plan Pro 🚀
              </button>
              
              <button className="premium-secondary-btn" onClick={() => setShowUpgradeModal(false)}>
                Seguir en Versión de Prueba
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
