# BYDLang VM

This folder contains the virtual machine that runs BYDLang scripts.
Each instruction is implemented in a file inside `instructions/` and registered
in `index.js`.

To add a new instruction create a file exporting a function with the signature
`(tokens, state, events, debug)` that modifies the state and returns
`{ ok: true }` or `{ ok: false, error }`. Then add the reference in the
`handlers` object of `index.js`.
