import { Worker } from 'worker_threads';

// Synchronous execution of potentially untrusted WASM code. The module is run
// inside a worker so that it can be terminated if it takes too long. A shared
// buffer is used to communicate the result back to this thread.
export default function runWasm(base64Code, context = {}, timeout = 100) {
    const shared = new SharedArrayBuffer(8); // [status, result]
    const view = new Int32Array(shared);

    const worker = new Worker(new URL('./wasmWorker.js', import.meta.url), {
        workerData: { code: base64Code, context, shared }
    });

    const timer = setTimeout(() => {
        // 1 indicates the execution timed out
        Atomics.store(view, 0, 1);
        worker.terminate();
        Atomics.notify(view, 0);
    }, timeout);

    // Wait until the worker finishes or timeout triggers
    Atomics.wait(view, 0, 0);
    clearTimeout(timer);

    const status = Atomics.load(view, 0);
    const result = Atomics.load(view, 1);
    return status === 2 && result === 1;
}
