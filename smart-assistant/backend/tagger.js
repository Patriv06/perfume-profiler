/**
 * Heuristics-based product auto-tagger for the Smart Shopping Assistant.
 * Scans title and description text for keywords to assign quiz attribute tags.
 */
const autoTagProduct = (name, description = '', category = 'vinos') => {
  const tags = [];
  const text = `${name.toLowerCase()} ${(description || '').toLowerCase()}`;

  if (category === 'vinos') {
    // 1. Sabor (Tinto, Blanco, Rosado)
    let hasTinto = false;
    let hasBlanco = false;
    let hasRosado = false;

    if (
      text.includes('tinto') ||
      text.includes('malbec') ||
      text.includes('cabernet') ||
      text.includes('syrah') ||
      text.includes('merlot') ||
      text.includes('bonarda') ||
      text.includes('blend') ||
      text.includes('pinot noir') ||
      text.includes('corte')
    ) {
      hasTinto = true;
      tags.push({ key: 'sabor', value: 'tinto' });
    }

    if (
      text.includes('blanco') ||
      text.includes('chardonnay') ||
      text.includes('sauvignon') ||
      text.includes('torrontes') ||
      text.includes('viognier') ||
      text.includes('semillon') ||
      text.includes('chenin')
    ) {
      hasBlanco = true;
      tags.push({ key: 'sabor', value: 'blanco' });
    }

    if (
      text.includes('rose') ||
      text.includes('rosado') ||
      text.includes('dulce') ||
      text.includes('cosecha tardia') ||
      text.includes('tardio') ||
      text.includes('espumante rosado')
    ) {
      hasRosado = true;
      tags.push({ key: 'sabor', value: 'rosado' });
    }

    // Default to tinto if no flavor is matched to keep it working
    if (!hasTinto && !hasBlanco && !hasRosado) {
      tags.push({ key: 'sabor', value: 'tinto' });
    }

    // 2. Maridaje (Carnes, Pastas, Pescados, Quesos)
    if (text.includes('tinto') || text.includes('malbec') || text.includes('cabernet') || text.includes('asado') || text.includes('carne') || text.includes('roja') || text.includes('parrilla')) {
      tags.push({ key: 'maridaje', value: 'carnes' });
    }
    if (text.includes('pastas') || text.includes('pasta') || text.includes('salsa') || text.includes('bolognesa') || text.includes('queso maduro') || text.includes('tinto') || text.includes('blend')) {
      tags.push({ key: 'maridaje', value: 'pastas' });
    }
    if (text.includes('blanco') || text.includes('pescado') || text.includes('mariscos') || text.includes('ensalada') || text.includes('sushi') || text.includes('pollo') || text.includes('fresco')) {
      tags.push({ key: 'maridaje', value: 'pescados' });
    }
    if (text.includes('picada') || text.includes('queso') || text.includes('quesos') || text.includes('fiambre') || text.includes('jamon') || text.includes('entrada') || text.includes('rosado') || text.includes('rose') || text.includes('dulce')) {
      tags.push({ key: 'maridaje', value: 'quesos' });
    }

    // Fallbacks
    if (tags.filter(t => t.key === 'maridaje').length === 0) {
      tags.push({ key: 'maridaje', value: 'carnes' });
    }

    // 3. Ocasion (Cena, Asado, Regalo, Relax)
    if (text.includes('reserva') || text.includes('gran reserva') || text.includes('caja') || text.includes('estuche') || text.includes('madera') || text.includes('regalo') || text.includes('obsequio')) {
      tags.push({ key: 'ocasion', value: 'regalo' });
    }
    if (text.includes('premium') || text.includes('icono') || text.includes('cena') || text.includes('romantica') || text.includes('formal') || text.includes('barrica')) {
      tags.push({ key: 'ocasion', value: 'cena' });
    }
    if (text.includes('asado') || text.includes('amigos') || text.includes('juntada') || text.includes('parrilla') || text.includes('reunion')) {
      tags.push({ key: 'ocasion', value: 'asado' });
    }
    if (text.includes('relax') || text.includes('tarde') || text.includes('copa') || text.includes('diario') || text.includes('fresco') || text.includes('ligero') || text.includes('frutado')) {
      tags.push({ key: 'ocasion', value: 'relax' });
    }

    if (tags.filter(t => t.key === 'ocasion').length === 0) {
      tags.push({ key: 'ocasion', value: 'relax' });
    }

  } else if (category === 'perfumes') {
    // 1. Gender (Hombre, Mujer, Unisex)
    let hasMan = false;
    let hasWoman = false;
    let hasUnisex = false;

    if (text.includes('hombre') || text.includes('him') || text.includes('men') || text.includes('homme') || text.includes('masculin') || text.includes('boy')) {
      hasMan = true;
      tags.push({ key: 'gender', value: 'Hombre' });
    }
    if (text.includes('mujer') || text.includes('her') || text.includes('women') || text.includes('femme') || text.includes('feminin') || text.includes('girl') || text.includes('queen')) {
      hasWoman = true;
      tags.push({ key: 'gender', value: 'Mujer' });
    }
    if (text.includes('unisex') || text.includes('compartido') || text.includes('neutral') || (!hasMan && !hasWoman)) {
      hasUnisex = true;
      tags.push({ key: 'gender', value: 'Unisex' });
    }

    // 2. Moment (Día, Noche)
    let hasDay = false;
    let hasNight = false;

    if (text.includes('dia') || text.includes('day') || text.includes('fresco') || text.includes('diario') || text.includes('oficina') || text.includes('sport') || text.includes('verano') || text.includes('primavera')) {
      hasDay = true;
      tags.push({ key: 'moment', value: 'Día' });
    }
    if (text.includes('noche') || text.includes('night') || text.includes('intenso') || text.includes('intense') || text.includes('seduc') || text.includes('misterio') || text.includes('cena') || text.includes('invierno')) {
      hasNight = true;
      tags.push({ key: 'moment', value: 'Noche' });
    }

    if (!hasDay && !hasNight) {
      tags.push({ key: 'moment', value: 'Día' });
    }

    // 3. Note (Cítrico, Amaderado, Floral, Oriental)
    let hasNote = false;
    if (text.includes('citrico') || text.includes('fresco') || text.includes('limon') || text.includes('pomelo') || text.includes('bergamota') || text.includes('marino') || text.includes('agua') || text.includes('menta')) {
      tags.push({ key: 'note', value: 'Cítrico' });
      hasNote = true;
    }
    if (text.includes('amaderado') || text.includes('madera') || text.includes('cedro') || text.includes('sandalo') || text.includes('cuero') || text.includes('wood') || text.includes('vetiver')) {
      tags.push({ key: 'note', value: 'Amaderado' });
      hasNote = true;
    }
    if (text.includes('floral') || text.includes('flores') || text.includes('jazmin') || text.includes('rosa') || text.includes('peonia') || text.includes('gardenia') || text.includes('azahar')) {
      tags.push({ key: 'note', value: 'Floral' });
      hasNote = true;
    }
    if (text.includes('oriental') || text.includes('vainilla') || text.includes('dulce') || text.includes('pachuli') || text.includes('especias') || text.includes('canela') || text.includes('ambar')) {
      tags.push({ key: 'note', value: 'Oriental' });
      hasNote = true;
    }

    if (!hasNote) {
      tags.push({ key: 'note', value: 'Floral' });
    }
  }

  return tags;
};

module.exports = { autoTagProduct };
