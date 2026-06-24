FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_HTTP_API_URL

ENV VITE_HTTP_API_URL=$VITE_HTTP_API_URL

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output