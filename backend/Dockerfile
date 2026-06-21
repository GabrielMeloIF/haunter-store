FROM node:24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install          # instala TUDO, incluindo devDependencies
COPY . .
RUN npm run build
RUN npx prisma generate

RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --resolveJsonModule --skipLibCheck 2>/dev/null || \
    cp prisma/seed.ts dist/prisma/seed.ts

FROM node:24-alpine AS production

WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY entrypoint.sh ./
RUN sed -i 's/\r//' entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 4000
CMD ["./entrypoint.sh"]