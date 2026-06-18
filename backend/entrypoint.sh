#!/bin/sh
set -e

echo "⏳ Aguardando MySQL ficar pronto..."
until npx prisma db push --skip-generate; do
  echo "🔄 Tentando em 5s..."
  sleep 5
done

echo "🌱 Rodando seed..."

node dist/prisma/seed.js

echo "🚀 Iniciando backend..."
exec node dist/src/main