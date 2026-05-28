# Setup: Banco de Dados Compartilhado

## 🎯 Objetivo
Todos os devs da equipe acessam o **mesmo banco de dados** para que mudanças apareçam para todo mundo.

## 📋 Opção 1: Um Dev Roda o Docker (Recomendado)

### Passo 1: Designar o "Servidor"
Um desenvolvedor será o responsável por rodar o Docker com o banco:

```bash
cd haunter-store
docker-compose up -d
```

Anote o **IP local** da máquina dele (Windows: `ipconfig`)

### Passo 2: Outros Devs Se Conectam

No `.env` de cada dev que **não está rodando o Docker**, altere:

```env
# ❌ Errado (cada um no seu)
DATABASE_URL="mysql://root:aluno@localhost:3306/haunter_store"

# ✅ Correto (aponta para o servidor central)
DATABASE_URL="mysql://root:aluno@192.168.1.100:3306/haunter_store"
```

⚠️ Substitua `192.168.1.100` pelo **IP real do dev que está rodando Docker**.

### Passo 3: Sincronizar Migrations

Todos precisam ter as mesmas migrations:

```bash
cd backend
npm install
prisma migrate deploy
```

## 🔄 Fluxo de Trabalho

1. **Novo dev joins**: Copia `.env.example` → `.env` e altera o IP do banco
2. **Criar mudança no banco**: Edita `prisma/schema.prisma` e roda:
   ```bash
   prisma migrate dev --name descricao_da_mudanca
   ```
3. **Fazer commit**: A migration fica em `prisma/migrations/` (versionada!)
4. **Outro dev puxa mudanças**:
   ```bash
   git pull
   prisma migrate deploy
   ```

## 📦 Opção 2: Banco Remoto (se preferir)

Se quiserem centralizar sem ligar uma máquina 24/7:

1. Criar um banco no [Railway](https://railway.app), [Vercel Postgres](https://vercel.com/storage/postgres), ou similar
2. Todos usam o mesmo `DATABASE_URL` remoto
3. Mesmo fluxo de migrations

## ✅ Checklist

- [ ] Dev 1 rodando Docker: `docker-compose up -d`
- [ ] Outros devs atualizando `.env` com IP correto
- [ ] Todos rodaram: `prisma migrate deploy`
- [ ] Testar criando um produto e vendo aparecer nos outros PCs
