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

  // Form states
  const [category, setCategory] = useState('vinos');
  const [title, setTitle] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [accentColor, setAccentColor] = useState('#722F37');
  const [backgroundColor, setBackgroundColor] = useState('#1A1112');
  const [buttonText, setButtonText] = useState('Comenzar');

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
        setCategory(data.category);
        setTitle(data.quiz_config.title || '');
        setWelcomeText(data.quiz_config.welcome_text || '');
        setAccentColor(data.quiz_config.accent_color || '#722F37');
        setBackgroundColor(data.quiz_config.background_color || '#1A1112');
        setButtonText(data.quiz_config.button_text || 'Comenzar');
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
    e.preventDefault();
    setSavingConfig(true);
    setSaveMessage('');

    axios.post(`${API_URL}/api/admin/config?store_id=${storeId}`, {
      category,
      quiz_config: {
        title,
        welcome_text: welcomeText,
        accent_color: accentColor,
        background_color: backgroundColor,
        button_text: buttonText
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

  // Open Tag Editor Modal for a product
  const startEditingTags = (product) => {
    // Clone tags so we can modify locally
    const productTags = product.tags ? [...product.tags] : [];
    
    // Set default tags layout depending on active category
    let initialTagState = {};
    if (category === 'vinos') {
      const saborTag = productTags.find(t => t.key === 'sabor');
      const maridajeTags = productTags.filter(t => t.key === 'maridaje').map(t => t.value);
      const ocasionTags = productTags.filter(t => t.key === 'ocasion').map(t => t.value);

      initialTagState = {
        sabor: saborTag ? saborTag.value : 'tinto',
        maridaje: maridajeTags,
        ocasion: ocasionTags
      };
    } else {
      const genderTag = productTags.find(t => t.key === 'gender');
      const momentTag = productTags.find(t => t.key === 'moment');
      const noteTag = productTags.find(t => t.key === 'note');

      initialTagState = {
        gender: genderTag ? genderTag.value : 'Unisex',
        moment: momentTag ? momentTag.value : 'Día',
        note: noteTag ? noteTag.value : 'Floral'
      };
    }

    setEditingProduct({
      ...product,
      editedTags: initialTagState
    });
  };

  const handleTagValueChange = (key, value, isCheckbox = false) => {
    if (!editingProduct) return;

    let updatedEditedTags = { ...editingProduct.editedTags };

    if (isCheckbox) {
      const currentValues = updatedEditedTags[key] || [];
      if (currentValues.includes(value)) {
        updatedEditedTags[key] = currentValues.filter(val => val !== value);
      } else {
        updatedEditedTags[key] = [...currentValues, value];
      }
    } else {
      updatedEditedTags[key] = value;
    }

    setEditingProduct({
      ...editingProduct,
      editedTags: updatedEditedTags
    });
  };

  const handleSaveTags = () => {
    if (!editingProduct) return;

    // Convert local editedTags structure into array of {key, value}
    const formattedTags = [];
    const et = editingProduct.editedTags;

    if (category === 'vinos') {
      if (et.sabor) formattedTags.push({ key: 'sabor', value: et.sabor });
      if (et.maridaje) {
        et.maridaje.forEach(v => formattedTags.push({ key: 'maridaje', value: v }));
      }
      if (et.ocasion) {
        et.ocasion.forEach(v => formattedTags.push({ key: 'ocasion', value: v }));
      }
    } else {
      if (et.gender) formattedTags.push({ key: 'gender', value: et.gender });
      if (et.moment) formattedTags.push({ key: 'moment', value: et.moment });
      if (et.note) formattedTags.push({ key: 'note', value: et.note });
    }

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

        {config && (
          <div className="store-badge-card">
            <span className="store-status-dot"></span>
            <div>
              <div className="store-name">{config.store_name}</div>
              <a href={config.store_url} target="_blank" rel="noopener noreferrer" className="store-url">
                {config.store_url.replace(/https?:\/\//, '')} ↗
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Grid */}
      <div className="admin-main-grid">
        
        {/* Left Column: Config Forms */}
        <div className="grid-column-left">
          <div className="admin-card config-card">
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
                </select>
                <p className="form-help-text">
                  Al cambiar de categoría se cargarán automáticamente las preguntas específicas de ese rubro.
                </p>
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

              <div className="colors-row">
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
                    />
                  </div>
                </div>

                <div className="form-group color-picker-group">
                  <label className="form-label">Fondo del Asistente</label>
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
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={savingConfig}>
                  {savingConfig ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                {saveMessage && <span className="save-feedback">{saveMessage}</span>}
              </div>
            </form>
          </div>

          {/* Script Integration Card */}
          <div className="admin-card script-card">
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
          <div className="admin-card preview-card">
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
      <section className="admin-products-section">
        <div className="products-section-header">
          <div>
            <h2 className="section-title">📦 Matriz de Recomendación de Productos</h2>
            <p className="section-subtitle">
              Sincronizá tus artículos de Tiendanube y gestioná las etiquetas del recomendador.
            </p>
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

              {category === 'vinos' ? (
                // WINES TEMPLATE TAGS
                <div className="modal-tag-selectors">
                  <div className="tag-selector-group">
                    <label className="tag-label">Perfil de Sabor (Elegir Uno)</label>
                    <div className="tag-radio-options">
                      {['tinto', 'blanco', 'rosado'].map((v) => (
                        <label key={v} className="tag-radio-label">
                          <input
                            type="radio"
                            name="sabor"
                            checked={editingProduct.editedTags.sabor === v}
                            onChange={() => handleTagValueChange('sabor', v)}
                          />
                          {v.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="tag-selector-group">
                    <label className="tag-label">Maridaje Recomendado (Multiselección)</label>
                    <div className="tag-checkbox-options">
                      {[
                        { label: 'Carnes Rojas / Asado', val: 'carnes' },
                        { label: 'Pastas / Salsas rojas', val: 'pastas' },
                        { label: 'Pescados / Ensaladas', val: 'pescados' },
                        { label: 'Quesos / Picadas', val: 'quesos' }
                      ].map((item) => (
                        <label key={item.val} className="tag-checkbox-label">
                          <input
                            type="checkbox"
                            checked={(editingProduct.editedTags.maridaje || []).includes(item.val)}
                            onChange={() => handleTagValueChange('maridaje', item.val, true)}
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="tag-selector-group">
                    <label className="tag-label">Ocasión de Consumo (Multiselección)</label>
                    <div className="tag-checkbox-options">
                      {[
                        { label: 'Cena formal / Romántica', val: 'cena' },
                        { label: 'Asado / Juntada informal', val: 'asado' },
                        { label: 'Regalo especial', val: 'regalo' },
                        { label: 'Relajarse después del día', val: 'relax' }
                      ].map((item) => (
                        <label key={item.val} className="tag-checkbox-label">
                          <input
                            type="checkbox"
                            checked={(editingProduct.editedTags.ocasion || []).includes(item.val)}
                            onChange={() => handleTagValueChange('ocasion', item.val, true)}
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // PERFUMES TEMPLATE TAGS
                <div className="modal-tag-selectors">
                  <div className="tag-selector-group">
                    <label className="tag-label">Público / Género</label>
                    <div className="tag-radio-options">
                      {['Hombre', 'Mujer', 'Unisex'].map((v) => (
                        <label key={v} className="tag-radio-label">
                          <input
                            type="radio"
                            name="gender"
                            checked={editingProduct.editedTags.gender === v}
                            onChange={() => handleTagValueChange('gender', v)}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="tag-selector-group">
                    <label className="tag-label">Momento del Día</label>
                    <div className="tag-radio-options">
                      {['Día', 'Noche'].map((v) => (
                        <label key={v} className="tag-radio-label">
                          <input
                            type="radio"
                            name="moment"
                            checked={editingProduct.editedTags.moment === v}
                            onChange={() => handleTagValueChange('moment', v)}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="tag-selector-group">
                    <label className="tag-label">Nota Olfativa Principal</label>
                    <div className="tag-radio-options">
                      {['Cítrico', 'Amaderado', 'Floral', 'Oriental'].map((v) => (
                        <label key={v} className="tag-radio-label">
                          <input
                            type="radio"
                            name="note"
                            checked={editingProduct.editedTags.note === v}
                            onChange={() => handleTagValueChange('note', v)}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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

    </div>
  );
};

export default Dashboard;
