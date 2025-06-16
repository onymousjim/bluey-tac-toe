# Use nginx alpine image for lightweight static file serving
FROM nginx:alpine

# Copy static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY bluey.png /usr/share/nginx/html/
COPY bingo.png /usr/share/nginx/html/

# Copy custom nginx configuration template and startup script
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start nginx with environment variable substitution
CMD ["/start.sh"]