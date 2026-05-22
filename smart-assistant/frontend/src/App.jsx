import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import QuizWidget from './components/QuizWidget';
import Playground from './components/Playground';
import './App.css';

function App() {
  const [view, setView] = useState('playground');
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    // Parse URL params for view and store_id
    const params = new URLSearchParams(window.location.search);
    const storeIdParam = params.get('store_id');
    
    // Determine view: if path contains 'widget' or query param view=widget
    const pathIsWidget = window.location.pathname.includes('/widget');
    const viewParam = params.get('view');
    
    let currentView = 'playground';
    if (viewParam === 'widget' || pathIsWidget) {
      currentView = 'widget';
    } else if (storeIdParam) {
      currentView = 'admin';
    }

    setView(currentView);
    
    // In production, Tiendanube dashboard might load inside an iframe.
    // In mock mode, we want a default store_id if not specified.
    if (storeIdParam) {
      setStoreId(storeIdParam);
    } else if (currentView === 'widget') {
      // Fallback for widget demo if no store_id is given
      setStoreId('9999999'); // Wines demo
    }
  }, []);

  useEffect(() => {
    if (view === 'widget') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.backgroundColor = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [view]);

  if (view === 'widget') {
    return <QuizWidget storeId={storeId} />;
  }

  if (view === 'playground') {
    return <Playground />;
  }

  return <Dashboard storeId={storeId} />;
}

export default App;
