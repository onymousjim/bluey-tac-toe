# Use nginx alpine image for lightweight static file serving
FROM nginx:alpine

# Copy static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY bluey.png /usr/share/nginx/html/
COPY bingo.png /usr/share/nginx/html/

# Copy custom nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start nginx with environment variable substitution
CMD envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'