# Haunter Store — Setup do Banco de Dados

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
