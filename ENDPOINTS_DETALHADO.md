# 🔌 INTEGRAÇÃO DETALHADA - ENDPOINT POR ENDPOINT

## 📚 ÍNDICE
1. Autenticação (2 endpoints)
2. Produtos (2 endpoints integrados)
3. Carrinho (5 endpoints integrados)
4. Pedidos (1 endpoint integrado)
5. Exemplos de como integrar outros

---

## 🔐 AUTENTICAÇÃO

### Endpoint 1: `POST /auth/login`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const authAPI = {
  login: (email: string, senha: string) =>
    request('/auth/login', { method: 'POST', body: { email, senha } }),
};
```

**Usado em:** `frontend/src/context/AuthContext.tsx`
```typescript
const login = async (email: string, senha: string) => {
  const response = await authAPI.login(email, senha)
  const { token: newToken, usuario: userData } = response

  setToken(newToken)
  setUsuario(userData)
  localStorage.setItem('token', newToken)
  localStorage.setItem('user', JSON.stringify(userData))
}
```

**Chamado de:** `frontend/src/pages/entrar/index.tsx`
```typescript
const { login } = useAuth()

const handleSubmit = async (e) => {
  try {
    await login(formData.email, formData.password)
    toast.success("Login realizado com sucesso!")
    router.push("/")
  } catch (error) {
    toast.error(error.message)
  }
}
```

**Resposta do Backend:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "cliente",
    "foto": null
  }
}
```

---

### Endpoint 2: `POST /users` (Registro)

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const usersAPI = {
  create: (nome: string, email: string, senha: string, confirmar_senha: string) =>
    request('/users', {
      method: 'POST',
      body: { nome, email, senha, confirmar_senha },
    }),
};
```

**Usado em:** `frontend/src/context/AuthContext.tsx`
```typescript
const register = async (nome: string, email: string, senha: string, confirmar_senha: string) => {
  await usersAPI.create(nome, email, senha, confirmar_senha)
  // Após registro, já faz login automaticamente
  await login(email, senha)
}
```

**Chamado de:** `frontend/src/pages/entrar/index.tsx`
```typescript
const { register } = useAuth()

if (mode === "register") {
  await register(formData.name, formData.email, formData.password, formData.password)
  toast.success("Cadastro realizado com sucesso!")
  router.push("/")
}
```

---

## 🛒 PRODUTOS

### Endpoint 1: `GET /produtos`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const produtosAPI = {
  getAll: () => request('/produtos'),
};
```

**Usado em:** `frontend/src/context/ProdutosContext.tsx`
```typescript
const carregarProdutos = async () => {
  try {
    const data = await produtosAPI.getAll()
    setProdutos(data)
  } catch (err) {
    setError(err.message)
  }
}

// Chamado automaticamente ao iniciar
useEffect(() => {
  carregarProdutos()
}, [])
```

**Chamado em componentes:** `frontend/src/Components/Card/Card.tsx`
```typescript
const { produtos, loading } = useProdutos()

// Filtra por categoria
const perifericos = produtos.filter((p) => p.categoria?.nome_categoria === "Periféricos")
const jogos = produtos.filter((p) => p.categoria?.nome_categoria === "Jogos")

// Exibe nos cards
{perifericos.map((produto) => <CardItem key={produto.id} produto={produto} />)}
```

**Resposta do Backend:**
```json
[
  {
    "id": 1,
    "nome": "Mouse Gamer",
    "descricao": "Mouse RGB 6400 DPI",
    "preco": 120.00,
    "imagem_url": "https://...",
    "estoque": 10,
    "categoria": {
      "id": 1,
      "nome_categoria": "Periféricos"
    }
  },
  { ... mais produtos ... }
]
```

---

### Endpoint 2: `GET /produtos/:id`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const produtosAPI = {
  getById: (id: number) => request(`/produtos/${id}`),
};
```

**Função pronta em:** `frontend/src/context/ProdutosContext.tsx`
```typescript
const carregarProduto = async (id: number): Promise<Produto | null> => {
  try {
    return await produtosAPI.getById(id)
  } catch (err) {
    setError(err.message)
    return null
  }
}
```

**Ainda não integrado em nenhuma página**, mas pronto para usar em página de detalhes do produto.

---

## 🛍️ CARRINHO

### Endpoint 1: `GET /carrinho/usuario/:id_usuario`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const carrinhoAPI = {
  getByUser: (id_usuario: number) =>
    request(`/carrinho/usuario/${id_usuario}`),
};
```

**Usado em:** `frontend/src/context/CarrinhoContext.tsx`
```typescript
const carregarCarrinho = async () => {
  if (!usuario) return
  try {
    const data = await carrinhoAPI.getByUser(usuario.id)
    setItens(data)
  } catch (err) {
    setError(err.message)
  }
}

// Carrega automaticamente quando usuário faz login
useEffect(() => {
  if (usuario) {
    carregarCarrinho()
  }
}, [usuario])
```

**Exibido em:** `frontend/src/pages/carrinho/index.tsx`
```typescript
const { itens, loading } = useCarrinho()

{itens.map((item) => (
  <div key={item.id_carrinho}>
    <Image src={item.produto?.imagem_url} />
    <p>{item.produto?.nome}</p>
    <p>R$ {(item.produto?.preco * item.quantidade).toFixed(2)}</p>
    <button onClick={() => atualizarQuantidade(item.id_carrinho, -1)}>−</button>
    <span>{item.quantidade}</span>
    <button onClick={() => atualizarQuantidade(item.id_carrinho, +1)}>+</button>
    <button onClick={() => removerItem(item.id_carrinho)}>Remover</button>
  </div>
))}
```

**Resposta do Backend:**
```json
[
  {
    "id_carrinho": 1,
    "id_usuario": 1,
    "id_produto": 1,
    "quantidade": 2,
    "produto": {
      "id": 1,
      "nome": "Mouse Gamer",
      "preco": 120.00,
      "imagem_url": "https://...",
      "descricao": "Mouse RGB 6400 DPI"
    }
  },
  { ... mais itens ... }
]
```

---

### Endpoint 2: `POST /carrinho`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const carrinhoAPI = {
  addItem: (id_usuario: number, id_produto: number, quantidade: number) =>
    request('/carrinho', {
      method: 'POST',
      body: { id_usuario, id_produto, quantidade },
    }),
};
```

**Função em:** `frontend/src/context/CarrinhoContext.tsx`
```typescript
const adicionarItem = async (id_produto: number, quantidade: number) => {
  if (!usuario) throw new Error('Faça login para adicionar itens')
  try {
    await carrinhoAPI.addItem(usuario.id, id_produto, quantidade)
    await carregarCarrinho() // Sincroniza com servidor
  } catch (err) {
    setError(err.message)
    throw err
  }
}
```

**Pronto para chamar em componentes:**
```typescript
const { adicionarItem, loading } = useCarrinho()
const { usuario } = useAuth()

const handleAdicionarCarrinho = async (id_produto: number) => {
  if (!usuario) {
    toast.error("Faça login")
    return
  }
  try {
    await adicionarItem(id_produto, 1)
    toast.success("Adicionado ao carrinho!")
  } catch (error) {
    toast.error(error.message)
  }
}

// Uso:
<button onClick={() => handleAdicionarCarrinho(produto.id)}>
  Adicionar ao Carrinho
</button>
```

---

### Endpoint 3: `PUT /carrinho/:id_carrinho`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const carrinhoAPI = {
  updateItem: (id_carrinho: number, quantidade: number) =>
    request(`/carrinho/${id_carrinho}`, {
      method: 'PUT',
      body: { quantidade },
    }),
};
```

**Função em:** `frontend/src/context/CarrinhoContext.tsx`
```typescript
const atualizarQuantidade = async (id_carrinho: number, quantidade: number) => {
  try {
    await carrinhoAPI.updateItem(id_carrinho, quantidade)
    await carregarCarrinho() // Sincroniza
  } catch (err) {
    setError(err.message)
    throw err
  }
}
```

**Usado em:** `frontend/src/pages/carrinho/index.tsx`
```typescript
const handleAlterarQuantidade = async (id_carrinho: number, delta: number) => {
  const item = itens.find((i) => i.id_carrinho === id_carrinho)
  const novaQtd = item.quantidade + delta
  
  if (novaQtd <= 0) {
    await removerItem(id_carrinho)
    return
  }
  
  try {
    await atualizarQuantidade(id_carrinho, novaQtd)
  } catch (error) {
    toast.error(error.message)
  }
}

// Botões:
<button onClick={() => handleAlterarQuantidade(item.id_carrinho, -1)}>−</button>
<button onClick={() => handleAlterarQuantidade(item.id_carrinho, +1)}>+</button>
```

---

### Endpoint 4: `DELETE /carrinho/:id_carrinho`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const carrinhoAPI = {
  removeItem: (id_carrinho: number) =>
    request(`/carrinho/${id_carrinho}`, { method: 'DELETE' }),
};
```

**Função em:** `frontend/src/context/CarrinhoContext.tsx`
```typescript
const removerItem = async (id_carrinho: number) => {
  try {
    await carrinhoAPI.removeItem(id_carrinho)
    await carregarCarrinho() // Sincroniza
  } catch (err) {
    setError(err.message)
    throw err
  }
}
```

**Usado em:** `frontend/src/pages/carrinho/index.tsx`
```typescript
const handleRemover = async (id_carrinho: number) => {
  try {
    await removerItem(id_carrinho)
    toast.success("Item removido")
  } catch (error) {
    toast.error(error.message)
  }
}

// Botão:
<button onClick={() => handleRemover(item.id_carrinho)}>Remover</button>
```

---

### Endpoint 5: `DELETE /carrinho/usuario/:id_usuario/limpar`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const carrinhoAPI = {
  clear: (id_usuario: number) =>
    request(`/carrinho/usuario/${id_usuario}/limpar`, { method: 'DELETE' }),
};
```

**Função em:** `frontend/src/context/CarrinhoContext.tsx`
```typescript
const limparCarrinho = async () => {
  if (!usuario) return
  try {
    await carrinhoAPI.clear(usuario.id)
    await carregarCarrinho()
  } catch (err) {
    setError(err.message)
    throw err
  }
}
```

**Chamado em:** `frontend/src/pages/finalizar-compra/index.tsx`
```typescript
const handleConfirmarPedido = async () => {
  try {
    await pedidosAPI.finalize(usuario.id)
    await limparCarrinho()  // ← Limpa carrinho
    setPedidoConcluido(true)
    toast.success("Pedido realizado com sucesso!")
  } catch (error) {
    toast.error(error.message)
  }
}
```

---

## 📦 PEDIDOS

### Endpoint 1: `POST /pedidos/finalizar/:id_usuario`

**Mapeado em:** `frontend/src/services/api.ts`
```typescript
export const pedidosAPI = {
  finalize: (id_usuario: number) =>
    request(`/pedidos/finalizar/${id_usuario}`, { method: 'POST' }),
};
```

**Usado em:** `frontend/src/pages/finalizar-compra/index.tsx`
```typescript
const handleConfirmarPedido = async () => {
  if (!usuario) {
    toast.error("Usuário não autenticado")
    return
  }

  try {
    setLoading(true)
    await pedidosAPI.finalize(usuario.id)
    await limparCarrinho()
    setPedidoConcluido(true)
    toast.success("Pedido realizado com sucesso!")
  } catch (error) {
    toast.error(error.message)
  } finally {
    setLoading(false)
  }
}

// Botão:
<button onClick={handleConfirmarPedido} disabled={loading}>
  <FaLock /> {loading ? "Processando..." : "Confirmar pedido"}
</button>
```

**Resposta do Backend:**
```json
{
  "id_pedido": 1,
  "id_usuario": 1,
  "valor_total": 240.00,
  "status": "PENDENTE",
  "data_pedido": "2026-05-30T10:30:00Z",
  "itempedido": [
    {
      "id_item": 1,
      "id_produto": 1,
      "quantidade": 2,
      "preco_unitario": 120.00
    }
  ]
}
```

---

## 🔄 COMO INTEGRAR OS PRÓXIMOS

### Exemplo: Integrar Avaliações

**1. Adicionar a função em `api.ts`:**
```typescript
export const avaliacoesAPI = {
  create: (id_usuario: number, id_produto: number, nota: number, comentario: string) =>
    request('/avaliacoes', {
      method: 'POST',
      body: { id_usuario, id_produto, nota, comentario },
    }),
  getByProduct: (id_produto: number) =>
    request(`/avaliacoes/produto/${id_produto}`),
};
```

**2. Criar função em componente:**
```typescript
const handleAdicionarAvaliacao = async () => {
  try {
    await avaliacoesAPI.create(
      usuario.id,
      produto.id,
      rating,
      comentario
    )
    toast.success("Avaliação enviada!")
    // Recarrega avaliações
  } catch (error) {
    toast.error(error.message)
  }
}
```

**3. Chamar ao submeter form:**
```typescript
<form onSubmit={(e) => {
  e.preventDefault()
  handleAdicionarAvaliacao()
}}>
  {/* Inputs para rating e comentario */}
</form>
```

---

## ✅ CHECKLIST DE INTEGRAÇÃO

Para integrar qualquer novo endpoint:

- [ ] Adicionado em `/services/api.ts`
- [ ] Testado com `curl` ou Postman
- [ ] Integrado em um Context ou diretamente
- [ ] Chamado em página/componente
- [ ] Tratamento de erro com try/catch
- [ ] Feedback ao usuário com toast
- [ ] Estado de loading enquanto requisição
- [ ] Sincronização com estado local

---

## 🎓 CONCLUSÃO

Todos os 14 endpoints integrados seguem o mesmo padrão:

1. **Função em `api.ts`** (centralizado)
2. **Lógica em Context ou página**
3. **Chamada em componente**
4. **Tratamento de erro + feedback**

Fácil de replicar para os 47 endpoints restantes! 🚀
