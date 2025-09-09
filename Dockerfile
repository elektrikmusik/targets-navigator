# Multi-stage Dockerfile for production optimization
# Optimized for security, performance, and minimal attack surface

# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for build process
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G nodejs -g nodejs nodejs

# Copy package files first for better layer caching
COPY package*.json ./
COPY bun.lockb* ./

# Install dependencies with security optimizations
RUN npm ci --only=production --legacy-peer-deps --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/*

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the application
RUN npm run build && \
    rm -rf node_modules && \
    rm -rf src && \
    rm -rf public && \
    rm -rf .git && \
    rm -rf .github && \
    rm -rf documentation && \
    rm -rf migrations && \
    rm -rf supabase && \
    rm -rf *.md && \
    rm -rf *.json && \
    rm -rf *.js && \
    rm -rf *.ts && \
    rm -rf *.config.* && \
    rm -rf .eslintrc.* && \
    rm -rf .gitignore && \
    rm -rf .cursor && \
    rm -rf components.json && \
    rm -rf tailwind.config.* && \
    rm -rf tsconfig.* && \
    rm -rf vite.config.* && \
    rm -rf global.d.ts && \
    rm -rf auto-imports.d.ts

# Production stage
FROM nginx:1.25-alpine AS production

# Install security updates and required packages
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    curl \
    dumb-init \
    tzdata && \
    rm -rf /var/cache/apk/* /tmp/*

# Set timezone
ENV TZ=UTC

# Create non-root user for security (check if group exists first)
RUN (addgroup -g 1001 -S nginx || true) && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions and ownership
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx

# Create necessary directories with proper permissions
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run

# Switch to non-root user
USER nginx

# Expose ports
EXPOSE 80

# Health check with improved reliability
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
