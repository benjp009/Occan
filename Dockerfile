# ============================
# Build stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (generates production build, sitemap, blog posts)
RUN npm run build

# ============================
# Production stage
# ============================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Copy only necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Change ownership to non-root user
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Cloud Run uses PORT env var (default 8080)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
