(function () {
  // Prevent duplicate initialization
  if (window.__SmartShoppingAssistantInitialized) return;
  window.__SmartShoppingAssistantInitialized = true;

  // 1. Detect store_id
  let storeId = null;
  
  // Try reading from Tiendanube's native global object
  if (window.LS && window.LS.store && window.LS.store.id) {
    storeId = String(window.LS.store.id);
  }
  
  // Try reading from script src query params (e.g. widget.js?store=7732051)
  const scriptTag = document.currentScript;
  const scriptSrc = scriptTag ? scriptTag.src : '';
  const scriptUrl = new URL(scriptSrc);
  const backendHost = scriptUrl.origin;
  
  if (!storeId) {
    const urlParams = new URLSearchParams(scriptUrl.search);
    storeId = urlParams.get('store') || urlParams.get('store_id');
  }

  // Fallback if not found
  if (!storeId) {
    console.warn('[Smart Assistant] Store ID not detected. Falling back to default demo.');
    storeId = '9999999'; // Default Wines Demo
  }

  // Determine Frontend Host
  let frontendHost = backendHost;
  if (backendHost.includes('localhost:5001')) {
    frontendHost = 'http://localhost:5173'; // Vite dev server port
  } else if (backendHost.includes('127.0.0.1:5001')) {
    frontendHost = 'http://127.0.0.1:5173';
  }

  // 2. Inject Styles for floating widget
  const style = document.createElement('style');
  style.innerHTML = `
    .smart-assistant-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #722F37; /* Fallback accent */
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 12px 24px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 2147483640;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .smart-assistant-launcher:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    }
    .smart-assistant-modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2147483645;
      display: none;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .smart-assistant-modal-container.active {
      display: flex;
      opacity: 1;
    }
    .smart-assistant-iframe-wrapper {
      width: 100%;
      max-width: 460px;
      height: 100%;
      max-height: 640px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      transform: scale(0.95);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .smart-assistant-modal-container.active .smart-assistant-iframe-wrapper {
      transform: scale(1);
    }
    .smart-assistant-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #111;
    }
    .smart-assistant-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: 10;
    }
    .smart-assistant-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
    @media (max-width: 500px) {
      .smart-assistant-iframe-wrapper {
        max-width: 100vw;
        max-height: 100vh;
        height: 100%;
        border-radius: 0;
      }
      .smart-assistant-launcher {
        bottom: 16px;
        right: 16px;
        padding: 10px 18px;
        font-size: 13px;
      }
    }
  `;
  document.head.appendChild(style);

  // 3. Create DOM Elements
  const launcher = document.createElement('button');
  launcher.className = 'smart-assistant-launcher';
  launcher.innerHTML = '<span>💡</span><span>Asistente de Compra</span>';
  document.body.appendChild(launcher);

  const modalContainer = document.createElement('div');
  modalContainer.className = 'smart-assistant-modal-container';
  
  const iframeWrapper = document.createElement('div');
  iframeWrapper.className = 'smart-assistant-iframe-wrapper';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'smart-assistant-close-btn';
  closeBtn.innerHTML = '×';
  
  const iframe = document.createElement('iframe');
  iframe.className = 'smart-assistant-iframe';
  
  iframeWrapper.appendChild(closeBtn);
  iframeWrapper.appendChild(iframe);
  modalContainer.appendChild(iframeWrapper);
  document.body.appendChild(modalContainer);

  // 4. Load config dynamically to match launcher accent color before click
  fetch(`${backendHost}/api/widget/config?store_id=${storeId}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.theme && data.theme.accent_color) {
        launcher.style.backgroundColor = data.theme.accent_color;
      }
      if (data && data.store_name) {
        launcher.querySelector('span:last-child').textContent = data.category === 'vinos' ? 'Sommelier Virtual' : 'Asistente de Compra';
      }
    })
    .catch(err => console.warn('[Smart Assistant] Error fetching widget launcher style:', err));

  // 5. Open/Close event handlers
  const openWidget = () => {
    // Set iframe src only when opening to save load time and reload state
    const targetUrl = `${frontendHost}/?view=widget&store_id=${storeId}`;
    if (iframe.src !== targetUrl) {
      iframe.src = targetUrl;
    }
    
    modalContainer.style.display = 'flex';
    // Small delay to trigger transition
    setTimeout(() => {
      modalContainer.classList.add('active');
    }, 10);
  };

  const closeWidget = () => {
    modalContainer.classList.remove('active');
    setTimeout(() => {
      modalContainer.style.display = 'none';
    }, 300);
  };

  launcher.addEventListener('click', openWidget);
  closeBtn.addEventListener('click', closeWidget);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeWidget();
  });

  // 6. Handle Add to Cart Message from iframe
  window.addEventListener('message', function (event) {
    // Verify source host matches our frontend/backend
    if (!event.data || event.data.action !== 'smart_assistant_add_to_cart') return;

    const productId = event.data.product_id;
    const variantId = event.data.variant_id;

    console.log(`[Smart Assistant] Adding product to cart: Product ID = ${productId}, Variant ID = ${variantId}`);

    // Create and submit form to /comprar/
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/comprar/';
    form.style.display = 'none';

    if (productId && productId.indexOf('mock') === -1) {
      const inputProd = document.createElement('input');
      inputProd.name = 'add_to_cart';
      inputProd.value = productId;
      form.appendChild(inputProd);
    }

    const inputVariant = document.createElement('input');
    inputVariant.name = 'variant_id';
    inputVariant.value = variantId;
    form.appendChild(inputVariant);

    document.body.appendChild(form);
    form.submit();
  });
})();
