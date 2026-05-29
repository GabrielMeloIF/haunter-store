<<<<<<< HEAD
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
RUN npx prisma db push

FROM builder AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/src/main"]
=======
FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install --only=production

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate reset --force --skip-generate && node dist/src/main.js"]
>>>>>>> ee0de581ae518dcc1fb8e0fd775f727150b27981
