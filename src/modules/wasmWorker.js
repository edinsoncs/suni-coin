import { parentPort, workerData } from 'worker_threads';

const { code, context, shared } = workerData;
const view = new Int32Array(shared);

try {
  const wasmBuffer = Buffer.from(code, 'base64');
  const module = new WebAssembly.Module(wasmBuffer);
  // restrict memory to one page if module expects it via import
  const memory = new WebAssembly.Memory({ initial: 1, maximum: 1 });
  const instance = new WebAssembly.Instance(module, { env: { ...context, memory } });
  const main = instance.exports.main;
  let ok = false;
  if (typeof main === 'function') {
    ok = main() === 1;
  }
  view[1] = ok ? 1 : 0; // result index
} catch (err) {
  view[1] = 0;
}
view[0] = 2; // done
Atomics.notify(view, 0);
