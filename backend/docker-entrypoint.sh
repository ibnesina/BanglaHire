#!/bin/sh
set -e

# If the vendor directory is missing, install Composer dependencies
if [ ! -f vendor/autoload.php ]; then
    echo "Vendor directory not found. Running composer install..."
    composer install --prefer-dist --no-scripts --no-dev --no-interaction
fi

# Check if APP_KEY is not set or is empty, then generate one
if [ -z "$APP_KEY" ]; then
  echo "APP_KEY not set. Generating a new key..."
  php artisan key:generate --force
fi





exec php artisan serve --host=0.0.0.0 --port=8000
  
# Execute the container's main process (PHP-FPM)
# exec php-fpm