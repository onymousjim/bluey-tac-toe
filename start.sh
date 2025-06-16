#!/bin/sh

# Set default port if not provided
PORT=${PORT:-80}

# Replace PORT placeholder in nginx config
sed "s/\${PORT:-80}/$PORT/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
nginx -g 'daemon off;'