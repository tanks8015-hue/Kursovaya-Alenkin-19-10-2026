import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, 'dist');
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '""', url], {
        stdio: 'ignore',
        detached: true,
      }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
    } else {
      spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
    }
  } catch {
    // Ignore browser auto-open errors; URL is printed in console
  }
}

function startStaticServer(startPort = 3000) {
  const server = http.createServer((req, res) => {
    const reqUrl = (req.url || '/').split('?')[0];
    const safePath = path
      .normalize(decodeURIComponent(reqUrl))
      .replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(distDir, safePath === '/' ? 'index.html' : safePath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Файл не найден');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(content);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && startPort < 3010) {
      startStaticServer(startPort + 1);
    } else {
      console.error('Ошибка запуска сервера:', err.message);
    }
  });

  server.listen(startPort, '127.0.0.1', () => {
    const url = `http://localhost:${startPort}`;
    console.log('====================================================');
    console.log(`КВАНТ-СЕРВИС успешно запущен: ${url}`);
    console.log('Браузер откроется автоматически.');
    console.log('Для остановки сервера закройте окно или нажмите Stop (Shift+F5).');
    console.log('====================================================');
    openBrowser(url);
  });
}

// Если уже есть собранная папка dist (входит в репозиторий) — запускаем мгновенно без ошибок npm
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  startStaticServer(3000);
} else if (fs.existsSync(viteBin)) {
  console.log('Запуск Vite-сервера КВАНТ-СЕРВИС...');
  const child = spawn(process.execPath, [viteBin, '--port=3000', '--open'], {
    cwd: rootDir,
    stdio: 'inherit',
  });
  child.on('exit', (code) => process.exit(code ?? 0));
} else {
  console.error('Папка dist не найдена. Выполните npm install --legacy-peer-deps && npm run build');
}
