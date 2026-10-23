# Production Dockerfile for Kichuu Lagbe Backend API Server
FROM node:20-alpine

WORKDIR /app

# Copy root monorepo package manifests
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY server/ ./server/

WORKDIR /app/server

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/index.js"]
