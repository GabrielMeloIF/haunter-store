# Teste Integrado - Sistema de Mensagens

## 1. Criar uma Conversa
```bash
curl -X POST http://localhost:5000/conversas \
  -H "Content-Type: application/json" \
  -d '{
    "participantes": [1, 2]
  }'
```

**Resposta esperada:**
```json
{
  "id_conversa": 1,
  "criada_em": "2026-06-03T14:30:00Z",
  "participante1Id": 1,
  "participante2Id": 2,
  "participante1": {
    "id_usuario": 1,
    "nome": "Usuario 1",
    "email": "user1@email.com"
  },
  "participante2": {
    "id_usuario": 2,
    "nome": "Usuario 2",
    "email": "user2@email.com"
  },
  "mensagem": []
}
```

---

## 2. Enviar uma Mensagem
```bash
curl -X POST http://localhost:5000/mensagens \
  -H "Content-Type: application/json" \
  -d '{
    "id_conversa": 1,
    "id_remetente": 1,
    "conteudo": "Olá! Tudo bem?"
  }'
```

**Resposta esperada:**
```json
{
  "id_mensagem": 1,
  "id_conversa": 1,
  "id_remetente": 1,
  "conteudo": "Olá! Tudo bem?",
  "lida": false,
  "enviada_em": "2026-06-03T14:31:00Z",
  "usuario": {
    "id_usuario": 1,
    "nome": "Usuario 1",
    "email": "user1@email.com"
  }
}
```

---

## 3. Listar Mensagens de uma Conversa
```bash
curl -X GET http://localhost:5000/mensagens/conversa/1
```

**Resposta esperada:**
```json
[
  {
    "id_mensagem": 1,
    "id_conversa": 1,
    "id_remetente": 1,
    "conteudo": "Olá! Tudo bem?",
    "lida": false,
    "enviada_em": "2026-06-03T14:31:00Z",
    "usuario": {
      "id_usuario": 1,
      "nome": "Usuario 1",
      "email": "user1@email.com"
    }
  }
]
```

---

## 4. Marcar Mensagem como Lida
```bash
curl -X PATCH http://localhost:5000/mensagens/1/lida
```

**Resposta esperada:**
```json
{
  "id_mensagem": 1,
  "id_conversa": 1,
  "id_remetente": 1,
  "conteudo": "Olá! Tudo bem?",
  "lida": true,
  "enviada_em": "2026-06-03T14:31:00Z"
}
```

---

## 5. Obter Conversa por ID
```bash
curl -X GET http://localhost:5000/conversas/1
```

**Resposta esperada:**
```json
{
  "id_conversa": 1,
  "criada_em": "2026-06-03T14:30:00Z",
  "participante1Id": 1,
  "participante2Id": 2,
  "participante1": {
    "id_usuario": 1,
    "nome": "Usuario 1",
    "email": "user1@email.com"
  },
  "participante2": {
    "id_usuario": 2,
    "nome": "Usuario 2",
    "email": "user2@email.com"
  },
  "mensagem": [
    {
      "id_mensagem": 1,
      "id_conversa": 1,
      "id_remetente": 1,
      "conteudo": "Olá! Tudo bem?",
      "lida": true,
      "enviada_em": "2026-06-03T14:31:00Z"
    }
  ]
}
```

---

## 6. Listar Conversas de um Usuário
```bash
curl -X GET http://localhost:5000/conversas/usuario/1
```

**Resposta esperada:** Array com todas as conversas do usuário 1

---

## 7. Deletar uma Mensagem
```bash
curl -X DELETE http://localhost:5000/mensagens/1
```

**Resposta esperada:**
```json
{
  "id_mensagem": 1,
  "id_conversa": 1,
  "id_remetente": 1,
  "conteudo": "Olá! Tudo bem?",
  "lida": true,
  "enviada_em": "2026-06-03T14:31:00Z"
}
```

---

## 8. Deletar uma Conversa
```bash
curl -X DELETE http://localhost:5000/conversas/1
```

**Resposta esperada:**
```json
{
  "id_conversa": 1,
  "criada_em": "2026-06-03T14:30:00Z",
  "participante1Id": 1,
  "participante2Id": 2,
  "participante1": {...},
  "participante2": {...},
  "mensagem": [...]
}
```

---

## Endpoints Disponíveis

### Conversas
- `POST /conversas` - Criar conversa
- `GET /conversas` - Listar todas conversas
- `GET /conversas/:id` - Obter conversa por ID
- `GET /conversas/usuario/:id_usuario` - Conversas de um usuário
- `DELETE /conversas/:id` - Deletar conversa

### Mensagens
- `POST /mensagens` - Criar mensagem
- `GET /mensagens/conversa/:id_conversa` - Mensagens de uma conversa
- `GET /mensagens/:id` - Obter mensagem por ID
- `PATCH /mensagens/:id/lida` - Marcar como lida
- `DELETE /mensagens/:id` - Deletar mensagem

---

## Status do Sistema
✅ Backend: Funcionando
✅ Banco de Dados: Conectado
✅ Serviço de Conversas: Funcional
✅ Serviço de Mensagens: Funcional
✅ Relações de Usuários: Corrigidas
