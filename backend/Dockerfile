FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate

FROM builder AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/src/main"]
