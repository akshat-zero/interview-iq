import { spawn } from 'node:child_process';
import { createServer } from 'vite';

const node = process.execPath;
const api = spawn(node, ['server.mjs', '--api-only'], { stdio: 'inherit', env: process.env });
const vite = await createServer();
await vite.listen();
vite.printUrls();

async function stop() {
  api.kill();
  await vite.close();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
api.on('exit', code => {
  if (code && code !== 0) process.exitCode = code;
  void vite.close();
});
