@echo off
chcp 65001 >nul
echo Установка пакетов (если ещё не установлены)...
if not exist "node_modules" (
    call npm install
)
echo Запуск КВАНТ-СЕРВИС...
call npx vite --port=3000 --open
pause
