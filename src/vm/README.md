# BYDLang VM

Esta carpeta contiene la maquina virtual que ejecuta los scripts BYDLang.
Cada instrucción se implementa en un archivo dentro de `instructions/` y es
registrada en `index.js`.

Para añadir una nueva instrucción crea un archivo exportando una función con la
firma `(tokens, state, events, debug)` que modifique el estado y devuelva
`{ ok: true }` o `{ ok: false, error }`. Luego agrega la referencia en el objeto
`handlers` de `index.js`.
