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
    ],
    mock_products: [
      {
        name: 'Malbec Gran Reserva 2021',
        description: 'Vino tinto con cuerpo e intenso. Perfecto para acompañar carnes rojas asadas y asados con amigos. Crianza en barricas francesas.',
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
        price: '18500.00',
        sku: 'WNE-MAL-01',
        variant_id: 'mock-variant-wne-mal-01',
        canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-mal-01',
        tags: [
          { key: 'sabor', value: 'tinto' },
          { key: 'maridaje', value: 'carnes' },
          { key: 'ocasion', value: 'asado' },
          { key: 'ocasion', value: 'cena' }
        ]
      },
      {
        name: 'Chardonnay Estate Colección',
        description: 'Vino blanco fresco y ligero, con notas a manzana verde y durazno blanco. Ideal para pescados y mariscos, o para relajar después de una larga tarde.',
        image_url: 'https://images.unsplash.com/photo-1569919650476-f542182470f1?auto=format&fit=crop&q=80&w=600',
        price: '12400.00',
        sku: 'WNE-CHA-02',
        variant_id: 'mock-variant-wne-cha-02',
        canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-cha-02',
        tags: [
          { key: 'sabor', value: 'blanco' },
          { key: 'maridaje', value: 'pescados' },
          { key: 'ocasion', value: 'relax' }
        ]
      },
      {
        name: 'Blend Selección Premium Canto',
        description: 'Vino tinto de corte de uvas seleccionadas. Una botella elegante ideal para regalar o para una cena romántica y formal.',
        image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=600',
        price: '31000.00',
        sku: 'WNE-BLD-03',
        variant_id: 'mock-variant-wne-bld-03',
        canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-bld-03',
        tags: [
          { key: 'sabor', value: 'tinto' },
          { key: 'maridaje', value: 'carnes' },
          { key: 'maridaje', value: 'pastas' },
          { key: 'ocasion', value: 'cena' },
          { key: 'ocasion', value: 'regalo' }
        ]
      },
      {
        name: 'Rosé Tardío Dulce Natural',
        description: 'Un rosado sumamente refrescante, dulce y frutado. Combina a la perfección con picadas, quesos de todo tipo o fiambres.',
        image_url: 'https://images.unsplash.com/photo-1553184920-f80868a29db7?auto=format&fit=crop&q=80&w=600',
        price: '9800.00',
        sku: 'WNE-ROS-04',
        variant_id: 'mock-variant-wne-ros-04',
        canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-ros-04',
        tags: [
          { key: 'sabor', value: 'rosado' },
          { key: 'maridaje', value: 'quesos' },
          { key: 'ocasion', value: 'relax' }
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
    ],
    mock_products: [
      {
        name: 'Blue Seduction for Men',
        description: 'Una fragancia fresca y sensual, perfecta para el día a día. Destaca por sus notas chispeantes de menta y melón.',
        image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
        price: '25000.00',
        sku: 'BSD-M-01',
        variant_id: 'mock-variant-bsd-m-01',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-bsd-m-01',
        tags: [
          { key: 'gender', value: 'Hombre' },
          { key: 'moment', value: 'Día' },
          { key: 'note', value: 'Cítrico' }
        ]
      },
      {
        name: 'The Golden Secret',
        description: 'Un perfume misterioso, elegante y sumamente seductor pensado para la noche.',
        image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        price: '28000.00',
        sku: 'TGS-M-02',
        variant_id: 'mock-variant-tgs-m-02',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-tgs-m-02',
        tags: [
          { key: 'gender', value: 'Hombre' },
          { key: 'moment', value: 'Noche' },
          { key: 'note', value: 'Amaderado' }
        ]
      },
      {
        name: 'Queen of Seduction',
        description: 'Una fragancia ultra femenina y fresca ideal para el día con notas cítricas y acuáticas.',
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
        price: '26000.00',
        sku: 'QOS-F-01',
        variant_id: 'mock-variant-qos-f-01',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-qos-f-01',
        tags: [
          { key: 'gender', value: 'Mujer' },
          { key: 'moment', value: 'Día' },
          { key: 'note', value: 'Floral' }
        ]
      },
      {
        name: 'Her Secret Temptation',
        description: 'Un perfume oriental floral, dulce y sumamente cautivador para noches inolvidables.',
        image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
        price: '29000.00',
        sku: 'HST-F-02',
        variant_id: 'mock-variant-hst-f-02',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-hst-f-02',
        tags: [
          { key: 'gender', value: 'Mujer' },
          { key: 'moment', value: 'Noche' },
          { key: 'note', value: 'Oriental' }
        ]
      }
    ]
  },
  chocolates: {
    category: 'chocolates',
    title: 'Tu Chocolate Perfecto',
    welcome_text: 'Contestá estas breves preguntas y te diremos exactamente cuál es tu chocolate o trufa ideal para hoy.',
    theme: {
      accent_color: '#8C6239', // Sweet Cocoa
      background_color: '#2F1F17',
      text_color: '#ffffff',
      button_text: 'Tentarme 🍫'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Cómo preferís el porcentaje de cacao?',
        tag_key: 'cacao',
        options: [
          { text: 'Amargo (70% - 90%) 🍫', value: 'amargo', icon: '🍫' },
          { text: 'Con Leche o Suave 🥛', value: 'leche', icon: '🥛' },
          { text: 'Blanco y Cremoso 🍦', value: 'blanco', icon: '🍦' }
        ]
      },
      {
        id: 'q2',
        text: '¿Te gustan los ingredientes adicionales?',
        tag_key: 'adicional',
        options: [
          { text: 'Frutos Secos 🥜', value: 'frutos', icon: '🥜' },
          { text: 'Dulce de Leche o Relleno 🍯', value: 'relleno', icon: '🍯' },
          { text: 'Puro, sin agregados 🌱', value: 'puro', icon: '🌱' }
        ]
      }
    ],
    mock_products: [
      {
        name: 'Barra Dark Intensa 80%',
        description: 'Chocolate negro profundo elaborado con granos de cacao seleccionados. Ideal para amantes del sabor puro e intenso.',
        image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600',
        price: '3500.00',
        sku: 'choc1',
        variant_id: 'mock-variant-choc-1',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-choc-1',
        tags: [
          { key: 'cacao', value: 'amargo' },
          { key: 'adicional', value: 'puro' }
        ]
      },
      {
        name: 'Bombón Avellana Gold',
        description: 'Chocolates con leche extra cremosos rellenos de una suave crema de avellanas y trocitos crocantes tostados.',
        image_url: 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&q=80&w=600',
        price: '4200.00',
        sku: 'choc2',
        variant_id: 'mock-variant-choc-2',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-choc-2',
        tags: [
          { key: 'cacao', value: 'leche' },
          { key: 'adicional', value: 'frutos' }
        ]
      },
      {
        name: 'White Truffle Coco & Manjar',
        description: 'Trufas artesanales de chocolate blanco rellenas con crema de coco natural y un corazón de dulce de leche.',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
        price: '3800.00',
        sku: 'choc3',
        variant_id: 'mock-variant-choc-3',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-choc-3',
        tags: [
          { key: 'cacao', value: 'blanco' },
          { key: 'adicional', value: 'relleno' }
        ]
      }
    ]
  },
  ropa: {
    category: 'ropa',
    title: 'Encontrá tu Outfit Ideal',
    welcome_text: '¿No sabés qué ponerte? Nuestro asesor virtual de moda elegirá el atuendo perfecto según tu estilo.',
    theme: {
      accent_color: '#3B5998', // Denim Blue
      background_color: '#1A2536',
      text_color: '#ffffff',
      button_text: 'Vestirme 👕'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Cuál es tu estilo preferido?',
        tag_key: 'estilo',
        options: [
          { text: 'Elegante y Formal 👔', value: 'elegante', icon: '👔' },
          { text: 'Casual y Relajado 👕', value: 'casual', icon: '👕' },
          { text: 'Urbano y Deportivo 👟', value: 'urbano', icon: '👟' }
        ]
      },
      {
        id: 'q2',
        text: '¿Para qué clima estás buscando?',
        tag_key: 'clima',
        options: [
          { text: 'Clima Frío ❄️', value: 'frio', icon: '❄️' },
          { text: 'Clima Cálido ☀️', value: 'calido', icon: '☀️' }
        ]
      }
    ],
    mock_products: [
      {
        name: 'Saco Lana Premium Corte Italiano',
        description: 'Tapado de lana de abrigo pesado, corte entallado y terminaciones artesanales en solapa. Diseño clásico y elegante.',
        image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600',
        price: '45000.00',
        sku: 'rop1',
        variant_id: 'mock-variant-rop-1',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-rop-1',
        tags: [
          { key: 'estilo', value: 'elegante' },
          { key: 'clima', value: 'frio' }
        ]
      },
      {
        name: 'Remera Algodón Orgánico Oversize',
        description: 'Remera unisex confeccionada en algodón 100% orgánico certificado. Suave al tacto y de horma relajada para climas cálidos.',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
        price: '15000.00',
        sku: 'rop2',
        variant_id: 'mock-variant-rop-2',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-rop-2',
        tags: [
          { key: 'estilo', value: 'casual' },
          { key: 'clima', value: 'calido' }
        ]
      },
      {
        name: 'Campera Puffer Tech Streetwear',
        description: 'Campera inflable con aislamiento térmico ecológico. Tela exterior impermeable, bolsillos con cierres termosellados y capucha.',
        image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
        price: '38000.00',
        sku: 'rop3',
        variant_id: 'mock-variant-rop-3',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-rop-3',
        tags: [
          { key: 'estilo', value: 'urbano' },
          { key: 'clima', value: 'frio' }
        ]
      }
    ]
  },
  cafe: {
    category: 'cafe',
    title: 'Elegí tu Variedad de Café',
    welcome_text: 'Contanos tus gustos y el método de preparación que usás para recomendarte el grano de café de especialidad perfecto.',
    theme: {
      accent_color: '#5C4033', // Espresso
      background_color: '#1C130E',
      text_color: '#ffffff',
      button_text: 'Moler Café ☕'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Qué tipo de tostado te gusta más?',
        tag_key: 'tostado',
        options: [
          { text: 'Oscuro y Fuerte ☕', value: 'oscuro', icon: '☕' },
          { text: 'Medio y Equilibrado 🌱', value: 'medio', icon: '🌱' },
          { text: 'Claro y Frutal 🍋', value: 'claro', icon: '🍋' }
        ]
      },
      {
        id: 'q2',
        text: '¿Cómo lo preparás habitualmente?',
        tag_key: 'preparacion',
        options: [
          { text: 'Espresso 🇮🇹', value: 'espresso', icon: '🇮🇹' },
          { text: 'Prensa Francesa / Filtrado 💧', value: 'filtrado', icon: '💧' },
          { text: 'Con Leche / Capuccino 🥛', value: 'con_leche', icon: '🥛' }
        ]
      }
    ],
    mock_products: [
      {
        name: 'Gran Espresso Blend',
        description: 'Granos seleccionados con un tostado oscuro e intenso. Presenta notas marcadas a cacao amargo, nueces y crema densa.',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
        price: '9500.00',
        sku: 'caf1',
        variant_id: 'mock-variant-caf-1',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-caf-1',
        tags: [
          { key: 'tostado', value: 'oscuro' },
          { key: 'preparacion', value: 'espresso' }
        ]
      },
      {
        name: 'Geisha Honey Colombia',
        description: 'Café de especialidad de origen único con tostado claro. Ofrece notas florales a jazmín, durazno maduro y acidez cítrica brillante.',
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
        price: '14000.00',
        sku: 'caf2',
        variant_id: 'mock-variant-caf-2',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-caf-2',
        tags: [
          { key: 'tostado', value: 'claro' },
          { key: 'preparacion', value: 'filtrado' }
        ]
      },
      {
        name: 'Mocha Beans Selection',
        description: 'Tostado medio equilibrado. Con notas a avellana tostada y cuerpo sedoso, ideal para preparar capuccinos y lattes con leche.',
        image_url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600',
        price: '8900.00',
        sku: 'caf3',
        variant_id: 'mock-variant-caf-3',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-caf-3',
        tags: [
          { key: 'tostado', value: 'medio' },
          { key: 'preparacion', value: 'con_leche' }
        ]
      }
    ]
  },
  comidas: {
    category: 'comidas',
    title: '¿Qué vas a comer hoy? 🍽️',
    welcome_text: 'Respondé estas preguntas y nuestro asistente gourmet te recomendará el plato ideal según tus gustos y restricciones.',
    theme: {
      accent_color: '#E67E22', // Gourmet
      background_color: '#1A1412',
      text_color: '#ffffff',
      button_text: 'Elegir Menú 🍕'
    },
    questions: [
      {
        id: 'q1',
        text: '¿Tenés alguna restricción alimentaria?',
        tag_key: 'dieta',
        options: [
          { text: 'Vegana 🌱', value: 'vegana', icon: '🌱' },
          { text: 'Sin Gluten 🌾', value: 'sin_gluten', icon: '🌾' },
          { text: 'Sin restricciones 🍔', value: 'todo', icon: '🍔' }
        ]
      },
      {
        id: 'q2',
        text: '¿Qué tipo de plato preferís hoy?',
        tag_key: 'tipo_plato',
        options: [
          { text: 'Plato Caliente 🍲', value: 'caliente', icon: '🍲' },
          { text: 'Ensalada / Ligero 🥗', value: 'ligero', icon: '🥗' },
          { text: 'Algo Dulce / Postre 🍰', value: 'dulce', icon: '🍰' }
        ]
      }
    ],
    mock_products: [
      {
        name: 'Ensalada Quinoa & Palta Vegana 🌱',
        description: 'Ensalada fresca y nutritiva de quinoa orgánica, palta hass, tomates cherry, hojas de espinaca y aderezo cítrico. 100% de origen vegetal.',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        price: '9500.00',
        sku: 'com1',
        variant_id: 'mock-variant-com-1',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-com-1',
        tags: [
          { key: 'dieta', value: 'vegana' },
          { key: 'tipo_plato', value: 'ligero' }
        ]
      },
      {
        name: 'Ñoquis de Papa Sin Gluten 🌾',
        description: 'Ñoquis de papa artesanales elaborados con harina certificada libre de gluten, acompañados de salsa pomodoro y albahaca fresca.',
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
        price: '11200.00',
        sku: 'com2',
        variant_id: 'mock-variant-com-2',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-com-2',
        tags: [
          { key: 'dieta', value: 'sin_gluten' },
          { key: 'tipo_plato', value: 'caliente' }
        ]
      },
      {
        name: 'Volcán de Chocolate Vegano & Sin Gluten 🍫',
        description: 'Postre tibio con centro de chocolate fundido, libre de gluten y leche. Acompañado de una salsa fina de frutos rojos del bosque.',
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
        price: '8900.00',
        sku: 'com3',
        variant_id: 'mock-variant-com-3',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-com-3',
        tags: [
          { key: 'dieta', value: 'vegana' },
          { key: 'tipo_plato', value: 'dulce' }
        ]
      }
    ]
  },
  generico: {
    category: 'generico',
    title: 'Encontrá tu Producto Ideal 🎁',
    welcome_text: 'Respondé un par de preguntas y descubrí cuál es la mejor opción disponible para tus necesidades.',
    theme: {
      accent_color: '#9B59B6', // Tech
      background_color: '#18141F',
      text_color: '#ffffff',
      button_text: 'Descubrir 🚀'
    },
    questions: [
      {
        id: 'q1',
        text: '¿En qué ocasión vas a usar el producto?',
        tag_key: 'uso',
        options: [
          { text: 'Trabajo / Estudio 💼', value: 'trabajo', icon: '💼' },
          { text: 'Uso Diario / Ocio 🎮', value: 'ocio', icon: '🎮' }
        ]
      },
      {
        id: 'q2',
        text: '¿Cuál es tu principal prioridad?',
        tag_key: 'prioridad',
        options: [
          { text: 'Calidad Premium ⭐', value: 'premium', icon: '⭐' },
          { text: 'Precio / Oferta 🏷️', value: 'precio', icon: '🏷️' }
        ]
      }
    ],
    mock_products: [
      {
        name: 'Auriculares Inalámbricos Premium 🎧',
        description: 'Sonido de alta fidelidad, cancelación activa de ruido (ANC) y batería de hasta 40 horas. Ideal para tu día a día o estudio.',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        price: '24999.00',
        sku: 'gen1',
        variant_id: 'mock-variant-gen-1',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-gen-1',
        tags: [
          { key: 'uso', value: 'trabajo' },
          { key: 'prioridad', value: 'premium' }
        ]
      },
      {
        name: 'Mochila Urbana Ergonómica 🎒',
        description: 'Mochila resistente al agua con compartimento acolchado para notebook y bolsillos organizadores. Excelente relación precio-calidad.',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
        price: '14500.00',
        sku: 'gen2',
        variant_id: 'mock-variant-gen-2',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-gen-2',
        tags: [
          { key: 'uso', value: 'ocio' },
          { key: 'prioridad', value: 'precio' }
        ]
      },
      {
        name: 'Reloj Inteligente Fit Track ⌚',
        description: 'Monitoreo de actividad física, ritmo cardíaco y notificaciones en pantalla a color. Un compañero excelente para el ocio.',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
        price: '18900.00',
        sku: 'gen3',
        variant_id: 'mock-variant-gen-3',
        canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-gen-3',
        tags: [
          { key: 'uso', value: 'ocio' },
          { key: 'prioridad', value: 'premium' }
        ]
      }
    ]
  }
};

module.exports = templates;
