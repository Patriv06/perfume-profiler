const templates = {
  vinos: {
    category: 'vinos',
    title: 'Sommelier Virtual',
    welcome_text: '¿Buscando el vino perfecto? Te ayudamos a elegir el ideal para tu comida o reunión.',
    theme: {
      accent_color: '#722F37', // Burgundy
      background_color: '#1A1112',
      text_color: '#ffffff',
      button_text: 'Iniciar Consulta'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Qué vas a comer hoy? (Maridaje)',
        tag_key: 'maridaje',
        options: [
          { text: 'Carnes rojas o asado', value: 'carnes', icon: '🥩' },
          { text: 'Pastas con salsas rojas o condimentadas', value: 'pastas', icon: '🍝' },
          { text: 'Pescados, mariscos o ensaladas', value: 'pescados', icon: '🐟' },
          { text: 'Quesos, fiambres o picadas', value: 'quesos', icon: '🧀' }
        ]
      },
      {
        id: 'q2',
        text: '¿Qué tipo de perfil de sabor preferís?',
        tag_key: 'sabor',
        options: [
          { text: 'Tinto intenso y con cuerpo', value: 'tinto', icon: '🍷' },
          { text: 'Blanco fresco y ligero', value: 'blanco', icon: '🥂' },
          { text: 'Rosado / Dulce / Cosecha tardía', value: 'rosado', icon: '🍹' }
        ]
      },
      {
        id: 'q3',
        text: '¿Cuál es la ocasión del descorche?',
        tag_key: 'ocasion',
        options: [
          { text: 'Una cena especial o romántica', value: 'cena', icon: '🕯️' },
          { text: 'Un asado o juntada informal', value: 'asado', icon: '🔥' },
          { text: 'Un regalo elegante', value: 'regalo', icon: '🎁' },
          { text: 'Relajarme después de un largo día', value: 'relax', icon: '🛋️' }
        ]
      }
    ]
  },
  perfumes: {
    category: 'perfumes',
    title: 'Encontrá tu Perfume Ideal',
    welcome_text: 'Respondé 3 simples preguntas y descubrí la fragancia perfecta para vos.',
    theme: {
      accent_color: '#D4AF37', // Gold
      background_color: '#111111',
      text_color: '#ffffff',
      button_text: 'Comenzar Trivia'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Para quién es el perfume?',
        tag_key: 'gender',
        options: [
          { text: 'Para mí o un hombre', value: 'Hombre', icon: '👨' },
          { text: 'Para mí o una mujer', value: 'Mujer', icon: '👩' },
          { text: 'Busco algo unisex / neutro', value: 'Unisex', icon: '👥' }
        ]
      },
      {
        id: 'q2',
        text: '¿En qué momento del día planeás usarlo más?',
        tag_key: 'moment',
        options: [
          { text: 'Durante el día, para ir a trabajar o pasear', value: 'Día', icon: '☀️' },
          { text: 'Para salir de noche, eventos o citas', value: 'Noche', icon: '🌙' }
        ]
      },
      {
        id: 'q3',
        text: '¿Qué tipo de aromas te atraen más?',
        tag_key: 'note',
        options: [
          { text: 'Frescos y cítricos (limón, bergamota, notas marinas)', value: 'Cítrico', icon: '🍋' },
          { text: 'Amaderados y secos (madera de cedro, cuero, sándalo)', value: 'Amaderado', icon: '🪵' },
          { text: 'Florales y delicados (rosas, jazmín, flores blancas)', value: 'Floral', icon: '🌸' },
          { text: 'Cálidos y orientales (vainilla, especias, pachulí)', value: 'Oriental', icon: '✨' }
        ]
      }
    ]
  }
};

module.exports = templates;
