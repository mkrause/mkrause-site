#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

echo "Running  setup.sh..."

set -x # Print the commands being executed

apt-get update
apt-get install -q -y debconf-utils

# Basic dev tools
apt-get install -q -y curl vim git

# Apache/PHP
apt-get install -q -y apache2 php5

# MySQL
apt-get install -q -y mysql-server mysql-client
mysqladmin -u root password root

# phpMyAdmin
# sudo debconf-set-selections <<< 'phpmyadmin phpmyadmin/dbconfig-install boolean true'
# sudo debconf-set-selections <<< 'phpmyadmin phpmyadmin/app-password-confirm password pma'
# sudo debconf-set-selections <<< 'phpmyadmin phpmyadmin/mysql/admin-pass password pma'
# sudo debconf-set-selections <<< 'phpmyadmin phpmyadmin/mysql/app-pass password pma'
# sudo debconf-set-selections <<< 'phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2'﻿
# apt-get install -q -y phpmyadmin

# Enable mod_rewrite
# (Note: you should use `a2enmod` if available, in my case it wasn't for some reason)
ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load

# MongoDB
apt-get install -q -y mongodb php5-mongo

# Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin
sudo mv /usr/local/bin/composer.phar /usr/local/bin/composer # Rename to `composer`

# Node.js
# Installation on Wheezy: https://github.com/joyent/node/wiki/backports.debian.org
new_source="deb http://ftp.us.debian.org/debian wheezy-backports main"
if ! grep "$new_source" /etc/apt/sources.list; then
    echo "$new_source" >> /etc/apt/sources.list
    apt-get update
fi
apt-get install -q -y nodejs-legacy

# NPM
# http://stackoverflow.com/questions/20174399/cannot-install-npm-on-vagrant-during-provision
if ! which npm; then
    curl https://npmjs.org/install.sh | clean=no sh
    npm install -g bower
fi

rm -rf /var/www
ln -fs /vagrant /var/www

shopt -s dotglob # Enable globbing dot files
cp /vagrant/vagrant/files/home/* /root
cp /vagrant/vagrant/files/home/* /home/vagrant
