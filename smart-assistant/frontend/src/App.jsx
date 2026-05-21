import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import QuizWidget from './components/QuizWidget';
import './App.css';

function App() {
  const [view, setView] = useState('admin');
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    // Parse URL params for view and store_id
    const params = new URLSearchParams(window.location.search);
    const storeIdParam = params.get('store_id');
    
    // Determine view: if path contains 'widget' or query param view=widget
    const pathIsWidget = window.location.pathname.includes('/widget');
    const viewParam = params.get('view');
    
    let currentView = 'admin';
    if (viewParam === 'widget' || pathIsWidget) {
      currentView = 'widget';
    }

    setView(currentView);
    
    // In production, Tiendanube dashboard might load inside an iframe.
    // In mock mode, we want a default store_id if not specified.
    if (storeIdParam) {
      setStoreId(storeIdParam);
    } else if (currentView === 'widget') {
      // Fallback for widget demo if no store_id is given
      setStoreId('9999999'); // Wines demo
    } else {
      // Default to perfumes demo for admin dashboard if none specified
      setStoreId('7732051');
    }
  }, []);

  if (view === 'widget') {
    return <QuizWidget storeId={storeId} />;
  }

  return <Dashboard storeId={storeId} />;
}

export default App;
