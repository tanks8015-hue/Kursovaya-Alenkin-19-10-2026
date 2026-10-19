import { existsSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
process.chdir(rootDir);

if (!existsSync(resolve(rootDir, 'node_modules'))) {
  console.log('Установка зависимостей (первый запуск)...');
  execSync('npm install --legacy-peer-deps', {
    cwd: rootDir,
    stdio: 'inherit',
  });
}

console.log('Запуск сервера КВАНТ-СЕРВИС на http://localhost:3000 ...');
const child = spawn('npx', ['vite', '--port=3000', '--open'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
