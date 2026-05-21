(function() {
  // Prevent double loading
  if (window.PerfumeProfilerWidget) return;
  window.PerfumeProfilerWidget = true;

  // Configuration
  const APP_URL = 'https://perfume.quanticia.com.ar';
  
  // Inject CSS Styles
  const css = `
    /* Widget Launcher Button */
    #perfume-profiler-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #0b0b0b 0%, #1a1a1a 100%);
      border: 1px solid rgba(197, 161, 84, 0.4);
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(197, 161, 84, 0.25), inset 0 0 10px rgba(197, 161, 84, 0.1);
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    #perfume-profiler-launcher:hover {
      transform: scale(1.08) rotate(5deg);
      border-color: rgba(197, 161, 84, 0.8);
      box-shadow: 0 6px 25px rgba(197, 161, 84, 0.45);
    }
    #perfume-profiler-launcher svg {
      width: 26px;
      height: 26px;
      color: #e5c174;
      transition: transform 0.4s ease;
    }
    #perfume-profiler-launcher:hover svg {
      transform: scale(1.05);
    }
    
    /* Notification Badge */
    #perfume-profiler-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background-color: #c5a154;
      border: 2px solid #0b0b0b;
      border-radius: 50%;
      animation: perfume-pulse 2s infinite;
    }

    /* Launcher Pulse Effect */
    @keyframes perfume-pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(197, 161, 84, 0.7);
      }
      70% {
        box-shadow: 0 0 0 8px rgba(197, 161, 84, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(197, 161, 84, 0);
      }
    }

    /* Modal Overlay */
    #perfume-profiler-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(6, 6, 6, 0.8);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000000;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #perfume-profiler-modal.open {
      display: flex;
      opacity: 1;
    }

    /* Modal Container */
    #perfume-profiler-container {
      position: relative;
      width: 90%;
      max-width: 980px;
      height: 85%;
      max-height: 720px;
      background: #0b0b0b;
      border: 1px solid rgba(197, 161, 84, 0.25);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(197, 161, 84, 0.05);
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    #perfume-profiler-modal.open #perfume-profiler-container {
      transform: scale(1);
    }

    /* Close Button */
    #perfume-profiler-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(197, 161, 84, 0.2);
      border-radius: 50%;
      color: #e5c174;
      font-size: 20px;
      font-weight: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
      line-height: 1;
    }
    #perfume-profiler-close:hover {
      background: rgba(197, 161, 84, 0.15);
      border-color: rgba(197, 161, 84, 0.5);
      transform: rotate(90deg);
    }

    /* Iframe Styling */
    #perfume-profiler-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    }
  `;

  // Append styles
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(css));
  document.head.appendChild(styleEl);

  // Create Launcher Button
  const launcher = document.createElement('div');
  launcher.id = 'perfume-profiler-launcher';
  launcher.title = 'Encontrá tu fragancia ideal';
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 10a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V10z" />
      <path d="M9 7V4.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M6 11h12" />
      <path d="M12 7v4" />
      <circle cx="12" cy="15" r="2.5" stroke-dasharray="1 1" />
    </svg>
    <div id="perfume-profiler-badge"></div>
  `;
  document.body.appendChild(launcher);

  // Create Modal Structure
  const modal = document.createElement('div');
  modal.id = 'perfume-profiler-modal';
  modal.innerHTML = `
    <div id="perfume-profiler-container">
      <div id="perfume-profiler-close">&times;</div>
      <iframe id="perfume-profiler-iframe" src="about:blank" allow="clipboard-write"></iframe>
    </div>
  `;
  document.body.appendChild(modal);

  const iframe = document.getElementById('perfume-profiler-iframe');
  const closeBtn = document.getElementById('perfume-profiler-close');
  let iframeLoaded = false;

  // Toggle Modal Open/Close
  function openModal() {
    modal.style.display = 'flex';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Load iframe only once opened
    if (!iframeLoaded) {
      iframe.src = `${APP_URL}/?widget=true&origin=${encodeURIComponent(window.location.origin)}`;
      iframeLoaded = true;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modal.classList.contains('open')) {
        modal.style.display = 'none';
      }
    }, 300);
  }

  // Event Listeners
  launcher.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle messages from the widget iframe
  window.addEventListener('message', function(event) {
    // Security check: verify the origin matches the App URL
    if (event.origin !== APP_URL) return;

    if (event.data && typeof event.data === 'object') {
      const { type, url } = event.data;

      if (type === 'add_to_cart' || type === 'view_product') {
        // Redirection of top page to Tiendanube cart or product detail
        if (url) {
          closeModal();
          window.location.href = url;
        }
      }
    }
  });
})();
