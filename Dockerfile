# Build
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# İstersen turbopack/webpack’i explicit yap:
RUN npm run build -- --webpack

# Run
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm i --omit=dev --no-audit --no-fund

EXPOSE 3000
CMD ["npm","start"]
