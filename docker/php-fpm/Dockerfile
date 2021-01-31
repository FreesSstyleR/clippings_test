FROM php:7.2-fpm

RUN apt-get update

RUN apt-get install -y zlib1g-dev wget libpq-dev git libicu-dev libxml2-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-install zip xml

RUN curl --insecure https://getcomposer.org/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

RUN wget https://get.symfony.com/cli/installer -O - | bash

RUN export PATH="$HOME/.symfony/bin:$PATH"

RUN apt install -y nodejs

RUN apt install -y npm

RUN npm install --global yarn

# Set timezone
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Sofia /etc/localtime
RUN "date"

WORKDIR /var/www/symfony/clippings-test-app

RUN composer require --dev symfony/phpunit-bridge

RUN composer require symfony/webpack-encore-pack

RUN yarn install
