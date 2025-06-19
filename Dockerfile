# Use nginx alpine image for lightweight static file serving
FROM nginx:alpine

# Add build timestamp to bust cache
ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE}
RUN echo "Build date: ${BUILD_DATE}"

# Copy static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY Players/ /usr/share/nginx/html/Players/

# Copy custom nginx configuration template and startup script
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/start.sh"]