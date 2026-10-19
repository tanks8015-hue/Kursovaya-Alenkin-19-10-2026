import { existsSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';

if (!existsSync('./node_modules')) {
  console.log('Установка зависимостей (первый запуск)...');
  execSync('npm install', { stdio: 'inherit' });
}

console.log('Запуск сервера КВАНТ-СЕРВИС и открытие браузера...');
const child = spawn('npx', ['vite', '--port=3000', '--open'], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
