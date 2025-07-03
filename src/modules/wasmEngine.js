export default function runWasm(base64Code, context = {}) {
    try {
        const wasmBuffer = Buffer.from(base64Code, 'base64');
        const module = new WebAssembly.Module(wasmBuffer);
        const instance = new WebAssembly.Instance(module, { env: context });
        const main = instance.exports.main;
        if (typeof main !== 'function') return false;
        return main() === 1;
    } catch (err) {
        console.error('WASM execution failed:', err);
        return false;
    }
}
