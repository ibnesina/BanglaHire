# Use a PHP image with the version that matches your Laravel project (e.g., PHP 8.1)
FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
ENV COMPOSER_ALLOW_SUPERUSER=1
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


# Set working directory
# WORKDIR /var/www

# Copy existing application directory contents
# COPY . .

# Copy the entrypoint script into the container and make it executable
# COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Install Laravel dependencies
# RUN composer install --prefer-dist --no-scripts --no-dev --no-interaction

# Expose port if needed (or let the web server handle it)
# EXPOSE 8000


# ENTRYPOINT ["docker-entrypoint.sh"]