@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Установка пакетов (если ещё не установлены)...
if not exist "node_modules" (
    call npm install --legacy-peer-deps
)
echo Запуск КВАНТ-СЕРВИС...
call npx vite --port=3000 --open
pause
