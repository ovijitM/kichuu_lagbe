# Multi-stage Dockerfile for Kichuu Lagbe Frontend Client

# Stage 1: Build the Vite production bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo package manifests
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies using clean install
RUN npm ci

# Copy client source code
COPY client/ ./client/

# Build client production bundle
RUN npm run build -w client

# Stage 2: Serve compiled static files with Nginx
FROM nginx:1.27-alpine

# Copy custom Nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build from builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
