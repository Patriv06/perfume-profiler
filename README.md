# Perfume Profiler (Recomendador Inteligente de Fragancias)

Este es un recomendador inteligente de fragancias premium, inspirado en la fluidez y estética del sitio de Banderas Perfumes. Está diseñado en React + Tailwind CSS v4 para el frontend (adaptable para embeber en un `iframe` de Tiendanube) y Node.js + Express + SQLite para el backend. 

La estructura del monorepo está optimizada para desplegarse mediante **Dockploy** en servidores como Oracle Cloud.

---

## Estructura del Monorepo

```
perfumes/
├── docker-compose.yml       # Orquestación de contenedores (Frontend + Backend)
├── README.md                # Documentación del proyecto
├── backend/
│   ├── db.js                # Configuración de base de datos SQLite y seeding
│   ├── tiendanube.js        # Integración con la API de Tiendanube y simulación
│   ├── server.js            # Servidor Express.js y endpoints de recomendación
│   ├── Dockerfile           # Dockerfile del servicio backend
│   └── .env.example         # Variables de entorno de prueba para el backend
└── frontend/
    ├── nginx.conf           # Configuración de Nginx para servir estáticos y actuar como reverse proxy de /api
    ├── vite.config.js       # Configuración de Vite con proxy de desarrollo
    ├── index.html           # Documentación HTML y etiquetas meta de SEO
    ├── Dockerfile           # Dockerfile multi-stage para compilar React y montar Nginx
    └── src/
        ├── App.jsx          # Controlador principal del widget y flujo de estados
        ├── index.css        # Importación de Tailwind CSS v4, fuentes de lujo (Cinzel, Montserrat) y estilos fluidos
        └── components/      # Componentes UI encapsulados
            ├── Welcome.jsx  # Pantalla de inicio atractiva
            ├── Quiz.jsx     # Preguntas del recomendador (Género, Ocasión, Familia Aromática)
            ├── Loader.jsx   # Pantalla de carga animada
            └── Results.jsx  # Resultado sugerido con redirección directa al checkout
```

---

## Configuración y Despliegue en Dockploy

Dockploy permite desplegar este proyecto a partir de tu repositorio Git de dos formas:

### Opción A: Despliegue con Docker Compose (Recomendado)
Creá un único servicio en Dockploy apuntando a este repositorio y seleccionando el archivo `docker-compose.yml` en la raíz. Dockploy levantará ambos contenedores y los conectará en la red interna:
- El **Frontend** se expondrá en el puerto `8080` (que podés mapear a los puertos `80`/`443` en el reverse proxy de Dockploy).
- El **Backend** correrá internamente en el puerto `5000`.

### Opción B: Despliegue de Servicios Separados
Si preferís desplegar el frontend y el backend como dos servicios independientes en Dockploy:
1. **Backend**:
   - Directorio raíz del build: `/backend`
   - Dockerfile: `/backend/Dockerfile`
   - Puerto expuesto: `5000`
2. **Frontend**:
   - Directorio raíz del build: `/frontend`
   - Dockerfile: `/frontend/Dockerfile`
   - Puerto expuesto: `80`

*Nota: Si se despliegan por separado sin Compose, deberás asegurarte de que las peticiones a `/api` se resuelvan hacia el dominio o puerto del backend. El archivo `/frontend/nginx.conf` incluido asume por defecto que el contenedor backend está disponible bajo el nombre de host `backend` en la misma red.*

---

## Variables de Entorno (Backend)

En el backend podés configurar las siguientes variables de entorno (usá de base `/backend/.env.example` para crear un archivo `.env`):

* `PORT`: Puerto en el que corre el servidor backend (por defecto `5000`).
* `DATABASE_PATH`: Ruta absoluta o relativa al archivo SQLite (ej. `/data/perfumes.db` para persistirlo en Docker).
* `TIENDANUBE_STORE_ID`: ID numérico de tu tienda en Tiendanube.
* `TIENDANUBE_ACCESS_TOKEN`: Token de acceso (Bearer token) de la API de Tiendanube con alcances de escritura en productos.
* `TIENDANUBE_STORE_URL`: URL pública de tu tienda (ej. `https://mi-tienda.mitiendanube.com`). Se utiliza para armar los redireccionamientos directos al checkout.
* `TIENDANUBE_USER_AGENT`: Identificador obligatorio para la API de Tiendanube.

> **Modo Simulado (Mock Mode):**
> Si `TIENDANUBE_STORE_ID` o `TIENDANUBE_ACCESS_TOKEN` se dejan vacíos, el backend funcionará en **Modo Simulado (Mock Mode)** de forma automática. En este modo:
> - Las variantes de Tiendanube y redireccionamientos del checkout se generarán con IDs e hipervínculos simulados.
> - Podés probar el flujo de punta a punta de inmediato, sin necesidad de tener claves de API de Tiendanube reales.

---

## Ejecución en Entorno Local (Desarrollo)

Si querés probar o modificar la aplicación en tu computadora local:

### 1. Clonar el repositorio y configurar variables
Copiá el archivo `.env.example` a `.env` dentro de la carpeta `backend`:
```bash
cp backend/.env.example backend/.env
```

### 2. Levantar con Docker Compose (Recomendado)
Desde el directorio raíz:
```bash
docker-compose up --build
```
Esto compilará los contenedores y los dejará listos. Una vez encendido:
- Frontend disponible en: `http://localhost:8080`
- Backend disponible en: `http://localhost:5000`

### 3. Levantar de Forma Manual (Sin Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*El frontend en modo desarrollo (puerto `3000`) redirigirá automáticamente todas las peticiones a `/api` hacia el puerto `5000` del backend gracias a la configuración del proxy en `vite.config.js`.*

---

## Creación de los Productos de Prueba (Setup Inicial)

Para probar la recomendación dinámica y los redireccionamientos del carrito de compras, necesitás poblar las variantes en tu tienda o simularlas localmente.
El recomendador viene con un endpoint dedicado `/api/tiendanube/setup` que automatiza este proceso:

1. **Desde la Interfaz Gráfica (Recomendado):**
   Abrí la app en el navegador y hacé click en el botón dorado **"Generar Productos de Prueba"** ubicado en el panel de control del pie de página. Esto gatillará la creación o simulación.
2. **Desde Terminal:**
   Realizá una petición POST al backend:
   ```bash
   curl -X POST http://localhost:5000/api/tiendanube/setup
   ```

Este proceso:
- Creará 4 fragancias icónicas en la base de datos (con su momento de uso, género y notas).
- Si tenés configurada la API real de Tiendanube, creará físicamente los 4 productos en tu tienda, obtendrá sus `variant_id` y subirá sus imágenes.
- Si estás en modo mock, generará identificadores simulados en la base de datos local de SQLite de inmediato.
