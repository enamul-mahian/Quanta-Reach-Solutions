@echo off
setlocal
cd /d "%~dp0"
echo =====================================================
echo Quanta Reach Solutions - Laravel Local Setup
echo =====================================================
where php >nul 2>nul || (echo [ERROR] PHP 8.2+ is required.& pause & exit /b 1)
where composer >nul 2>nul || (echo [ERROR] Composer is required. Install Composer, reopen VS Code, then run this file again.& pause & exit /b 1)
if not exist .env copy .env.example .env >nul
composer install --no-interaction --prefer-dist || (echo [ERROR] Composer install failed.& pause & exit /b 1)
php artisan key:generate --force || goto :fail
php artisan migrate --force || goto :fail
php artisan db:seed --force || goto :fail
echo.
echo Create or update the Super Admin account:
php artisan qrs:create-admin || goto :fail
php artisan optimize:clear
start "" http://127.0.0.1:8000
php artisan serve --host=127.0.0.1 --port=8000
exit /b 0
:fail
echo [ERROR] Setup did not complete. Read INSTALL-BN.md.
pause
exit /b 1
