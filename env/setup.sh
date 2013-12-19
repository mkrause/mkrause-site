#!/usr/bin/env bash

apt-get update

# Basic tools
apt-get install -y curl vim git

# Apache and PHP
apt-get install -y apache2 php5

# Enable mod_rewrite
# (Note: you should use `a2enmod` if available, in my case it wasn't for some reason)
ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load

# MongoDB
apt-get install -y mongodb php5-mongo

# Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin
sudo mv /usr/local/bin/composer.phar /usr/local/bin/composer # Rename to `composer`

# Node.js
# Installation on Wheezy: https://github.com/joyent/node/wiki/backports.debian.org
echo "deb http://ftp.us.debian.org/debian wheezy-backports main" >> /etc/apt/sources.list
apt-get update
apt-get install nodejs-legacy
curl https://npmjs.org/install.sh | sh

npm install -g bower

#rm -rf /var/www
#ln -fs /vagrant /var/www
