# Start with Node.js 22 Alpine as the base image
FROM node:22.5.1-alpine3.20 AS base

# Install Chromium and required dependencies for Puppeteer and Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    wqy-zenhei

# Tell Puppeteer to skip installing Chromium (we installed it manually)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Tell Playwright to use system Chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ---------- deps stage ----------
FROM base AS deps

# Install libc6-compat to ensure compatibility with Alpine Linux
RUN apk add --no-cache libc6-compat

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json (if they exist) to the working directory
COPY package*.json ./

# Install dependencies using npm ci (clean install)
RUN npm ci

# ---------- builder stage ----------
FROM base AS builder
WORKDIR /app

# Copy node_modules from the 'deps' stage to the current stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all files from the current directory to the working directory
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build

# ---------- runner stage ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a system group named 'nodejs' with GID 1001
RUN addgroup --system --gid 1001 nodejs

# Create a system user named 'nextjs' with UID 1001
RUN adduser --system --uid 1001 nextjs

# Copy the public directory from the 'builder' stage
COPY --from=builder /app/public ./public

# Copy the .next directory from the 'builder' stage and set ownership to nextjs:nodejs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules and package.json from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use the 'nextjs' user from here on
USER nextjs

# Expose port 3000 and set the PORT environment variable
EXPOSE 3000
ENV PORT 3000

# Default command: start the Next.js application
CMD ["npm", "start"]
