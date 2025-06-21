import vm from 'vm';

export default function runScript(code, context = {}) {
    const sandbox = { ...context };
    const script = new vm.Script(code);
    const ctx = vm.createContext(sandbox);
    try {
        const result = script.runInContext(ctx, { timeout: 100 });
        return result === true;
    } catch (err) {
        console.error('Script execution failed:', err);
        return false;
    }
}
