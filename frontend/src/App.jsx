import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';
import Loader from './components/Loader';
import Results from './components/Results';
import { Info, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [answers, setAnswers] = useState({ gender: '', moment: '', note: '' });
  const [recommendation, setRecommendation] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [config, setConfig] = useState({ mode: 'mock', storeUrl: '' });
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // Fetch configuration on load
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('No se pudo conectar con el servidor backend.');
      const data = await res.json();
      setConfig(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching config:', err);
      // Fallback for development if backend not running yet
      setConfig({ mode: 'mock', storeUrl: 'https://tienda-simulada.mitiendanube.com' });
    }
  };

  // Sync test products helper
  const handleSyncProducts = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/tiendanube/setup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncStatus({
          type: 'success',
          message: data.mode === 'live'
            ? '¡Sincronizado! Se crearon los 4 productos de prueba en tu tienda de Tiendanube y se actualizaron las variantes locales.'
            : '¡Sincronización simulada completada! Variantes mock generadas localmente.'
        });
        // Refresh config to see mode update if any
        fetchConfig();
      } else {
        throw new Error(data.error || 'Error al sincronizar');
      }
    } catch (err) {
      setSyncStatus({
        type: 'error',
        message: `Error al sincronizar: ${err.message}`
      });
    } finally {
      setSyncing(false);
      // Auto clear sync status notification after 6 seconds
      setTimeout(() => {
        setSyncStatus(null);
      }, 6000);
    }
  };

  const handleStart = () => {
    setStep('gender');
    setAnswers({ gender: '', moment: '', note: '' });
    setRecommendation(null);
    setCheckoutUrl('');
    setError(null);
  };

  const handleNext = (currentAnswers) => {
    if (step === 'gender') setStep('moment');
    else if (step === 'moment') setStep('note');
    else if (step === 'note') {
      triggerRecommendation(currentAnswers || answers);
    }
  };

  const handleBack = () => {
    if (step === 'gender') setStep('welcome');
    else if (step === 'moment') setStep('gender');
    else if (step === 'note') setStep('moment');
  };

  const triggerRecommendation = async (finalAnswers) => {
    setStep('loading');
    setError(null);

    const activeAnswers = finalAnswers || answers;
    const startTime = Date.now();
    const queryParams = new URLSearchParams(activeAnswers).toString();

    try {
      const res = await fetch(`/api/recommend?${queryParams}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ocurrió un error al calcular la recomendación.');
      }
      
      const data = await res.json();

      // Ensure loading state lasts at least 2.2 seconds for premium visual effect
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, 2200 - elapsedTime);

      setTimeout(() => {
        setRecommendation(data.recommendation);
        setCheckoutUrl(data.checkoutUrl);
        setStep('results');
      }, delay);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al obtener recomendación. Verificá que el backend esté encendido.');
      setStep('welcome');
    }
  };

  const handleReset = () => {
    setStep('welcome');
    setAnswers({ gender: '', moment: '', note: '' });
    setRecommendation(null);
    setCheckoutUrl('');
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-luxury-black font-sans relative text-gray-200">
      
      {/* Decorative Grid Overlay Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,161,84,0.06)_0%,transparent_75%)] pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-5xl px-4">
          
          {/* Error Message Box */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-500/20 text-red-200 flex items-center gap-3 text-sm max-w-lg mx-auto">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error del sistema</p>
                <p className="text-xs text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Sync Status Banner */}
          {syncStatus && (
            <div className={`mb-6 p-4 rounded-lg border text-sm max-w-2xl mx-auto flex items-start gap-3 fade-in-slide ${
              syncStatus.type === 'success' 
                ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200' 
                : 'bg-red-950/30 border-red-500/20 text-red-200'
            }`}>
              {syncStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-grow text-left">
                <p className="font-semibold">{syncStatus.type === 'success' ? 'Éxito' : 'Error de Sincronización'}</p>
                <p className="text-xs opacity-90 mt-0.5">{syncStatus.message}</p>
              </div>
            </div>
          )}

          {/* Widget Controller */}
          {step === 'welcome' && <Welcome onStart={handleStart} />}
          
          {['gender', 'moment', 'note'].includes(step) && (
            <Quiz 
              step={step}
              answers={answers}
              setAnswers={setAnswers}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 'loading' && <Loader />}

          {step === 'results' && (
            <Results 
              recommendation={recommendation}
              checkoutUrl={checkoutUrl}
              onReset={handleReset}
              mode={config.mode}
            />
          )}

        </div>
      </main>

      {/* Embedded/Dockploy Status Dashboard (Footer) */}
      <footer className="w-full border-t border-white/5 py-4 bg-luxury-dark/90 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-gray-500 font-light">
          
          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${config.mode === 'live' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span>
                Backend: <strong className="font-medium text-gray-400">{config.mode === 'live' ? 'Conectado a Tiendanube' : 'Modo Simulado'}</strong>
              </span>
            </div>
            {config.storeUrl && (
              <div className="hidden sm:inline-flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-600" />
                <span className="truncate max-w-[200px]" title={config.storeUrl}>
                  Tienda: <a href={config.storeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 underline">{config.storeUrl}</a>
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions (Syncing & Testing) */}
          <div className="flex items-center gap-3">
            <button
              id="btn-sync-tiendanube"
              onClick={handleSyncProducts}
              disabled={syncing}
              className="px-3 py-1 bg-white/5 hover:bg-gold-400 hover:text-luxury-black text-gray-400 rounded border border-white/5 hover:border-gold-300 transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Generar Productos de Prueba'}
            </button>
            <span className="text-[10px] text-gray-600">v1.0.0</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
