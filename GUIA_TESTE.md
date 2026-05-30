# 🧪 GUIA RÁPIDO DE TESTE

## ⚙️ SETUP INICIAL

### 1. Inicie o Backend
```bash
cd backend
npm install  # se primeira vez
npm run start
```
✅ Backend rodando em `http://localhost:5000`

### 2. Inicie o Frontend
```bash
cd frontend
npm install  # se primeira vez
npm run dev
```
✅ Frontend rodando em `http://localhost:3000`

---

## 🧪 TESTES PASSO A PASSO

### ✅ TESTE 1: LOGIN & REGISTRO

**Objetivo**: Testar autenticação

1. Abra `http://localhost:3000/entrar`
2. Clique em "Criar" (modo registro)
3. Preencha:
   - Nome: `João Silva`
   - Email: `joao@email.com`
   - Senha: `123456`
4. Clique "Cadastrar"
5. ✅ **Esperado**: Redirecionado para home com toast "Cadastro realizado"
6. ✅ **Verifica**: Header mostra "J" (inicial do nome)

**Logout (teste se existir):**
1. Clique no ícone do usuário no header
2. Clique "Logout" (se botão existir)
3. Clique "Entrar" novamente
4. Modo login, digite email e senha de cima
5. ✅ **Esperado**: Login bem-sucedido

---

### ✅ TESTE 2: CARRINHO

**Objetivo**: Testar sincronização com banco de dados

1. Na home, vá para `/carrinho` (pelo header)
2. ✅ **Esperado**: Carrinho vazio com mensagem
3. ⚠️ **Nota**: Botão "Adicionar ao Carrinho" ainda precisa ser integrado
   - Você pode fazer manualmente uma chamada POST se quiser testar

**Para testar manualmente (usando fetch no console do navegador):**
```javascript
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('user'));

// Adicionar item ao carrinho
fetch('http://localhost:5000/carrinho', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_usuario: usuario.id,
    id_produto: 1,
    quantidade: 2
  })
})
.then(r => r.json())
.then(d => {
  alert('Item adicionado! Recarregue a página /carrinho');
  window.location.reload();
});
```

4. Após adicionar, a página mostra os itens
5. Teste +/- para alterar quantidade
6. Teste "Remover" para tirar item

---

### ✅ TESTE 3: PRODUTOS NA HOME

**Objetivo**: Testar carregamento de produtos

1. Vá para `http://localhost:3000/`
2. ✅ **Esperado**: Vê produtos agrupados por categoria
3. ✅ **Verifica**:
   - Título "Periféricos"
   - Título "Jogos"
   - Cards com imagem, nome, preço
   - Botões de ação

**Se não carregar:**
- Verifique console (F12 > Console tab)
- Verifique se backend está rodando
- Verifique `.env.local` tem `NEXT_PUBLIC_API_URL=http://localhost:5000`

---

### ✅ TESTE 4: FINALIZAR COMPRA

**Objetivo**: Testar fluxo completo de compra

1. Certifique que tem itens no carrinho (use test manual acima)
2. Vá para `/finalizar-compra`
3. **Etapa 1 - Endereço:**
   - Preencha CEP: `01310100`
   - ✅ **Esperado**: Busca CEP e auto-preenche rua/cidade
   - Preencha número: `100`
   - Clique "Continuar para pagamento"

4. **Etapa 2 - Pagamento:**
   - Escolha "Crédito"
   - Preencha cartão: `4111111111111111`
   - Preencha nome: `JOAO SILVA`
   - Preencha validade: `1225`
   - Preencha CVV: `123`
   - Parcelas: `1`
   - Clique "Revisar pedido"

5. **Etapa 3 - Revisão:**
   - Revise endereço e pagamento
   - Clique "Confirmar pedido"

6. ✅ **Esperado**:
   - Toast "Pedido realizado com sucesso!"
   - Página mostra ✓ "Pedido confirmado!"
   - Link para voltar à loja

---

## 🐛 TROUBLESHOOTING

### ❌ "Erro ao fazer requisição"
- [ ] Backend rodando em `:5000`?
- [ ] `.env.local` existe com URL correta?
- [ ] Verificou console (F12)?
- [ ] Recarregou página (Ctrl+R)?

### ❌ "Faça login para adicionar ao carrinho"
- [ ] Você está logado?
- [ ] Token em localStorage? (F12 > Application > localStorage > token)

### ❌ "Carrinho vazio mesmo após adicionar"
- [ ] Recarregou a página?
- [ ] Usuário logado é o mesmo?
- [ ] Verifique backend logs

### ❌ Produtos não carregam
- [ ] `/produtos` tem dados no banco?
- [ ] Verifique se backend retorna dados
  ```bash
  curl http://localhost:5000/produtos
  ```

### ❌ CEP não auto-preenche
- Isso é normal, o CEP lookup é apenas local
- A API ViaCEP pode estar indisponível
- Preencha manualmente

---

## 📱 TESTES NO MOBILE

Todos os componentes são responsivos. Teste em:
- iPhone (375px)
- iPad (768px)
- Desktop (1920px)

Abra DevTools: `F12` > Clique ícone de celular

---

## ✨ CHECKLIST FINAL

### Backend
- [ ] `npm run start` funciona
- [ ] Porta 5000 está livre
- [ ] Database está conectado
- [ ] Endpoints respondem com dados

### Frontend
- [ ] `npm run dev` funciona
- [ ] `.env.local` criado
- [ ] Contextos carregam sem erro
- [ ] Não há erros no console

### Integração
- [ ] Login funciona
- [ ] Produtos carregam
- [ ] Carrinho sincroniza
- [ ] Compra finaliza
- [ ] Token salvo em localStorage

---

## 🎯 PRÓXIMOS PASSOS

1. **Integrar botão "Adicionar ao Carrinho"**
   - No Card component, adicione botão com `handleAdicionarCarrinho`

2. **Criar página de Histórico de Pedidos**
   - Use `pedidosAPI.getByUser(usuarioId)`

3. **Criar página de Perfil com edição**
   - Use `updateUsuario()` do contexto

4. **Integrar Chat/Mensagens**
   - Criar novo contexto para conversas
   - Componente de chat em tempo real

---

## 📞 DÚVIDAS?

Se algo não funcionar:
1. Verifique se backend está rodando
2. Verifique console (F12)
3. Verifique network tab para ver requisições
4. Verifique localStorage tem token válido
5. Reinicie ambos servidores

**Boa sorte! 🚀**
