#!/bin/sh

# Use PORT environment variable from Cloud Run, default to 80
PORT=${PORT:-80}

# Replace PORT placeholder in nginx config
sed "s/\${PORT:-80}/$PORT/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
nginx -g 'daemon off;'