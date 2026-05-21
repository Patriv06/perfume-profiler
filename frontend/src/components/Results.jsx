import React from 'react';
import { ShoppingBag, RotateCcw, Sparkles, Check } from 'lucide-react';

export default function Results({ recommendation, checkoutUrl, productUrl, onReset, mode, isWidget }) {
  if (!recommendation) return null;

  // Format price in ARS local style
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(parseFloat(recommendation.price));

  const handleAddToCart = (e) => {
    if (isWidget) {
      e.preventDefault();
      window.parent.postMessage({ 
        type: 'add_to_cart', 
        url: checkoutUrl,
        productId: recommendation.tiendanube_id,
        variantId: recommendation.variant_id
      }, '*');
    }
  };

  const handleViewProduct = (e) => {
    if (isWidget) {
      e.preventDefault();
      window.parent.postMessage({ type: 'view_product', url: productUrl }, '*');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 fade-in-slide" id="results-screen">
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/20 bg-gold-950/20 text-gold-300 text-[10px] uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3 h-3" />
          Tu Fragancia Recomendada
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-[0.05em] text-white">
          EL RESULTADO
        </h2>
      </div>

      {/* Main Grid Card */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl p-6 md:p-10 mb-8 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Image Column */}
          <div className="col-span-1 md:col-span-5 flex justify-center">
            <div className="relative group max-w-[280px] w-full">
              {/* Gold Background Glow */}
              <div className="absolute inset-0 bg-gold-500/10 rounded-lg blur-2xl group-hover:bg-gold-500/20 transition-all duration-700 -z-10"></div>
              
              {/* Main Image Frame */}
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-luxury-black/60 flex items-center justify-center p-4">
                <img
                  src={recommendation.image_url}
                  alt={recommendation.name}
                  className="max-h-full max-w-full object-contain rounded transition-transform duration-700 group-hover:scale-105"
                  id="recommended-product-image"
                />
              </div>
              
              {/* SKU label */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-luxury-black/80 border border-white/5 text-[9px] font-mono tracking-widest text-gray-500">
                SKU: {recommendation.sku}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="col-span-1 md:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-[10px] uppercase tracking-widest text-gray-300 border border-white/5">
                {recommendation.gender}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-[10px] uppercase tracking-widest text-gray-300 border border-white/5">
                {recommendation.moment}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-gold-950/40 text-[10px] uppercase tracking-widest text-gold-300 border border-gold-400/20 font-semibold">
                Familia {recommendation.note}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide mb-2 leading-tight">
              {recommendation.name}
            </h3>

            {/* Price */}
            <span className="text-xl md:text-2xl font-light text-gold-300 tracking-wide mb-6">
              {formattedPrice}
            </span>

            {/* Divider */}
            <div className="h-[1px] w-full bg-white/10 mb-6"></div>

            {/* Description */}
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-8 tracking-wide">
              {recommendation.description}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-8 w-full">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span>Larga Duración</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span>Estética Premium</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span>Fórmula Exclusiva</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span>Importado Original</span>
              </div>
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <a
                id="btn-add-to-cart"
                href={checkoutUrl}
                target={isWidget ? "_self" : "_blank"}
                onClick={handleAddToCart}
                rel="noopener noreferrer"
                className="notranslate flex-grow px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-300 text-luxury-black font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(197,161,84,0.35)] hover:scale-[1.02] cursor-pointer"
                translate="no"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </a>
              <a
                id="btn-view-details"
                href={productUrl}
                target={isWidget ? "_self" : "_blank"}
                onClick={handleViewProduct}
                rel="noopener noreferrer"
                className="notranslate flex-grow px-6 py-4 border border-gold-400/50 text-gold-300 hover:text-white font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-300 hover:scale-[1.02] cursor-pointer"
                translate="no"
              >
                Ver Producto
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="btn-restart-test"
          onClick={onReset}
          className="px-6 py-3 border border-white/10 rounded-md text-gray-400 hover:text-white hover:border-white/30 text-xs uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Volver a realizar el test
        </button>
      </div>

      {/* Mode audit label for testing transparency */}
      {mode === 'mock' && (
        <div className="mt-8 text-center">
          <p className="text-[10px] text-amber-500/70 font-mono tracking-wide max-w-md mx-auto">
            [Modo Simulado Activo] La redirección apunta a una tienda ficticia. El ID de variante mapeado en DB es "{recommendation.variant_id}".
          </p>
        </div>
      )}
    </div>
  );
}
