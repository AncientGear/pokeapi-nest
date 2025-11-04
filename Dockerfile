# ===============================================
# Stage 1: Install dependencies only when needed
# ===============================================
FROM node:22.17.1-alpine3.22 AS deps

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile
RUN yarn install --frozen-lockfile

# ===============================================
# Stage 2: Build the application
# ===============================================
FROM node:22.17.1-alpine3.22 AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN yarn build

# ===============================================
# Stage 3: Production image
# ===============================================
FROM node:22.17.1-alpine3.22 AS runner

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the application files
RUN chown -R nestjs:nodejs /usr/src/app

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Start the application
CMD [ "node", "dist/main" ]