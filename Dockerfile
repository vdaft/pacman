# === Stage 1: Builder ===
FROM node:20 AS build

WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project source
COPY . .

# Build backend (TypeScript)
RUN npm run build

# Build frontend (Vite)
RUN npm run build:frontend || npm exec vite build

# === Stage 2: Runtime ===
FROM node:20-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy backend build
COPY --from=build /app/dist ./dist

# Copy frontend build (assuming Vite outputs to ./dist)
# We expose it as /public for Express
COPY --from=build /app/dist ./public

# Copy node_modules
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
