# Quanta Reach Solutions — Laravel Installation

এই package-এ original UI/CSS/animation structure সংরক্ষণ করে Firebase ও browser-side Cloudinary configuration বাদ দিয়ে Laravel session authentication, MySQL database, Laravel API এবং local media upload যুক্ত করা হয়েছে।

## Local Windows / VS Code

1. PHP 8.2 বা নতুন এবং Composer install করুন।
2. ZIP extract করুন।
3. `.env.example` copy করে `.env` করুন এবং MySQL database তথ্য বসান।
4. `SETUP-WINDOWS.bat` চালান। এটি dependencies, app key, migration, seeding এবং Super Admin account তৈরি করবে।
5. Browser: `http://127.0.0.1:8000`

Manual commands:

```powershell
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan qrs:create-admin
php artisan serve
```

## Hosting deployment

Laravel project root public web folder হওয়া উচিত `public/`। cPanel/Hostinger-এ document root সরাসরি `project/public` করতে পারলে সেটিই ব্যবহার করুন। তারপর:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --seed --force
php artisan qrs:create-admin
php artisan optimize
```

`storage/` ও `bootstrap/cache/` writable রাখুন। `.env` public download থেকে protected রাখুন। `APP_DEBUG=false` রাখুন।

## Database

MySQL database আগে তৈরি করে `.env`-এ `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` ঠিকভাবে দিন। Firebase configuration আর প্রয়োজন নেই।

## Important

`vendor/` package-এর মধ্যে নেই, কারণ Laravel-এর official dependencies hosting/local environment-এর PHP version অনুযায়ী Composer দিয়ে install করতে হয়। Composer install ছাড়া এটি Laravel হিসেবে চলবে না।
