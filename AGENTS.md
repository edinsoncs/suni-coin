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
