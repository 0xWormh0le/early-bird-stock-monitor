# financial-backend

1. `composer install`
2. `php artisan key:generate`
3. `php artisan voyager:install`
4. `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
5. `php artisan migrate`
6. `php artisan voyager:admin your@email.com --create`

Reference: https://iexcloud.io/docs/api/
