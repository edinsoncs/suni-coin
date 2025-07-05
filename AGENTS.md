# Codex Agent Instructions for BYDChain

Este repositorio implementa una cadena de bloques Delegated Proof‑of‑Stake en Node.js junto con una interfaz web en Next.js.

## Configuración local
- Requiere Node.js 18 o superior.
- Ejecuta `npm install` para instalar dependencias.
- Inicia el nodo y la interfaz con `npm run dev`.
- La API se expone en `http://localhost:8000` y la UI en `http://localhost:3000`.

## Pruebas y estilo
- Ejecuta `npm test` para correr la suite de Jest.
- Ejecuta `npm run eslint` para comprobar el estilo de código.
- Asegúrate de que las pruebas y el linter pasan antes de hacer commit.

## Guía de estilo
- Sigue el estilo existente en cada carpeta.
  - Los archivos de backend (`.js`) usan punto y coma y comillas simples.
  - Los archivos React/Next (`.ts`/`.tsx`) usan indentación de 2 espacios y no utilizan punto y coma.
- No incluyas archivos generados ni `node_modules` en los commits.

## Estructura del proyecto
- `src/` contiene la lógica de la blockchain y la API.
- `pages/` y `components/` conforman el frontend Next.js.
- `bin/cli.js` provee una herramienta de línea de comandos.
- Los datos persistentes viven en `src/storage/`.

## Descripción de archivos clave
- `README.md` explica el propósito general del proyecto.
- `index.js` es un ejemplo de creación de bloques en consola.
- `dev.js` lanza API y frontend simultáneamente para desarrollo.
- `main.js` inicia la versión de escritorio con Electron.
- `bin/cli.js` ofrece comandos para interactuar con el nodo y las carteras.
- `next.config.cjs` define la configuración de Next.js.
- `next-env.d.ts` contiene declaraciones de tipos generadas por Next.
- `tsconfig.json` configura el compilador TypeScript.
- `package.json` lista las dependencias y scripts disponibles.
- `package-lock.json` fija las versiones exactas de dichas dependencias.
- `components/` alberga los componentes React reutilizables.
- `pages/` define las rutas del frontend.
- `lib/` incluye utilidades compartidas.
- `__tests__/` contiene la suite de Jest.
- `src/blockchain/` implementa la cadena de bloques y el minado.
- `src/service/` expone la API HTTP.
- `src/middleware/` agrupa los endpoints de la API.
- `src/modules/` provee módulos auxiliares.
- `src/storage/` guarda la cadena, mempool y datos de wallets.
- `src/utils/` reúne funciones de apoyo.
- `src/wallet/` maneja las claves y operaciones de monedero.
- `src/public/` expone recursos estáticos.
- `src/miner/` ofrece utilidades para la minería automática.

## Variables de entorno
- `DB_TYPE` selecciona el backend de datos (`json`, `mongodb`, `mysql`, `postgres`, `firebase`).
- `DB_URI` define la URL de conexión.
- `DB_USER` y `DB_PASSWORD` configuran credenciales para MySQL y PostgreSQL.
- `FIREBASE_CERT` apunta al JSON de la cuenta de servicio de Firebase.

## Contribución
- Escribe los mensajes de commit en español y describe brevemente el cambio.
- Ejecuta `npm test` y `npm run eslint` antes de cada commit.
- Las Pull Requests deben incluir un resumen en español de los cambios y los resultados de las pruebas.
