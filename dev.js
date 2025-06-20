import { spawn } from 'child_process';

const processes = [];

function start(cmd, args) {
  const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
  processes.push(proc);
}

start('npm', ['run', 'nodemon']);
start('npm', ['run', 'front']);

function shutdown() {
  for (const p of processes) {
    p.kill();
  }
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

