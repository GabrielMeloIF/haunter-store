# Haunter Store — Setup do Banco de Dados

## ⚠️ Versão do Prisma

Este projeto usa **Prisma 5.22.0** (travado na versão exata).
Se você tiver o Prisma 6 ou 7 instalado globalmente, ele vai dar erro.

**Sempre use o Prisma local do projeto:**
```bash
npx prisma ...   # ✅ correto — usa o do node_modules
prisma ...       # ❌ pode usar o global errado
```

---

## 1. Configurar variável de ambiente

Crie o arquivo `backend/.env`:
```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/haunter_store"
```

---

## 2. Instalar dependências

```bash
cd backend
npm install
```

---

## 3. Rodar as migrations

```bash
cd backend
npx prisma migrate deploy
```

Isso vai criar todas as tabelas no banco:
- `Usuario`
- `Categoria`
- `Produto`
- `Carrinho`
- `Pedido`
- `ItemPedido`

---

## 4. (Opcional) Visualizar o banco

```bash
npx prisma studio
```

---

## 5. Rodar o servidor

```bash
npm run start:dev
```

---

## Endpoints disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /users | Listar usuários |
| POST | /users | Cadastrar usuário |
| GET | /categorias | Listar categorias |
| POST | /categorias | Criar categoria |
| GET | /produtos | Listar produtos |
| POST | /produtos | Criar produto |
| GET | /carrinho/usuario/:id | Ver carrinho do usuário |
| POST | /carrinho | Adicionar item ao carrinho |
| PUT | /carrinho/:id | Atualizar quantidade |
| DELETE | /carrinho/:id | Remover item |
| POST | /pedidos/finalizar/:id_usuario | Finalizar compra (vira pedido) |
| GET | /pedidos/usuario/:id | Histórico de pedidos |
| PATCH | /pedidos/:id/status | Atualizar status do pedido |
