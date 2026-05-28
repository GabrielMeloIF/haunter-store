FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install --only=production

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate reset --force --skip-generate && node dist/src/main.js"]