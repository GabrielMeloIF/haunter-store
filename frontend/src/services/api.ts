const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  token?: string;
};

async function request(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erro ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao fazer requisição');
  }
}

// Auth
export const authAPI = {
  login: (email: string, senha: string) =>
    request('/auth/login', { method: 'POST', body: { email, senha } }),
};

// Users
export const usersAPI = {
  getAll: () => request('/users'),
  getById: (id: number) => request(`/users/${id}`),
  create: (nome: string, email: string, senha: string, confirmar_senha: string) =>
    request('/users', {
      method: 'POST',
      body: { nome, email, senha, confirmar_senha },
    }),
  update: (id: number, data: any, token?: string) =>
    request(`/users/${id}`, { method: 'PUT', body: data, token }),
  delete: (id: number, token?: string) =>
    request(`/users/${id}`, { method: 'DELETE', token }),
};

// Produtos
export const produtosAPI = {
  getAll: () => request('/produtos'),
  getById: (id: number) => request(`/produtos/${id}`),
  create: (data: any, token?: string) =>
    request('/produtos', { method: 'POST', body: data, token }),
  update: (id: number, data: any, token?: string) =>
    request(`/produtos/${id}`, { method: 'PUT', body: data, token }),
  delete: (id: number, token?: string) =>
    request(`/produtos/${id}`, { method: 'DELETE', token }),
  createMany: (data: any[], token?: string) =>
    request('/produtos/lote', { method: 'POST', body: data, token }),
  updateMany: (data: any[], token?: string) =>
    request('/produtos/lote', { method: 'PUT', body: data, token }),
};

// Categorias
export const categoriasAPI = {
  getAll: () => request('/categorias'),
  getById: (id: number) => request(`/categorias/${id}`),
  create: (nome_categoria: string, descricao: string, token?: string) =>
    request('/categorias', {
      method: 'POST',
      body: { nome_categoria, descricao },
      token,
    }),
  update: (id: number, data: any, token?: string) =>
    request(`/categorias/${id}`, { method: 'PUT', body: data, token }),
  delete: (id: number, token?: string) =>
    request(`/categorias/${id}`, { method: 'DELETE', token }),
};

// Carrinho
export const carrinhoAPI = {
  getByUser: (id_usuario: number) =>
    request(`/carrinho/usuario/${id_usuario}`),
  addItem: (id_usuario: number, id_produto: number, quantidade: number) =>
    request('/carrinho', {
      method: 'POST',
      body: { id_usuario, id_produto, quantidade },
    }),
  updateItem: (id_carrinho: number, quantidade: number) =>
    request(`/carrinho/${id_carrinho}`, {
      method: 'PUT',
      body: { quantidade },
    }),
  removeItem: (id_carrinho: number) =>
    request(`/carrinho/${id_carrinho}`, { method: 'DELETE' }),
  clear: (id_usuario: number) =>
    request(`/carrinho/usuario/${id_usuario}/limpar`, { method: 'DELETE' }),
};

// Pedidos
export const pedidosAPI = {
  getAll: () => request('/pedidos'),
  getById: (id: number) => request(`/pedidos/${id}`),
  getByUser: (id_usuario: number) => request(`/pedidos/usuario/${id_usuario}`),
  finalize: (id_usuario: number) =>
    request(`/pedidos/finalizar/${id_usuario}`, { method: 'POST' }),
  updateStatus: (id: number, status: string, token?: string) =>
    request(`/pedidos/${id}/status`, {
      method: 'PATCH',
      body: { status },
      token,
    }),
};

// Avaliações
export const avaliacoesAPI = {
  getByProduct: (id_produto: number) =>
    request(`/avaliacoes/produto/${id_produto}`),
  getByUser: (id_usuario: number) =>
    request(`/avaliacoes/usuario/${id_usuario}`),
  getById: (id: number) => request(`/avaliacoes/${id}`),
  create: (id_usuario: number, id_produto: number, nota: number, comentario: string) =>
    request('/avaliacoes', {
      method: 'POST',
      body: { id_usuario, id_produto, nota, comentario },
    }),
  delete: (id: number, token?: string) =>
    request(`/avaliacoes/${id}`, { method: 'DELETE', token }),
};

// Cupons
export const cuponAPI = {
  getAll: () => request('/cupons'),
  getById: (id: number) => request(`/cupons/${id}`),
  getByUser: (id_usuario: number) =>
    request(`/cupons/usuario/${id_usuario}`),
  create: (codigo: string, descricao: string, desconto: number, validade: string, token?: string) =>
    request('/cupons', {
      method: 'POST',
      body: { codigo, descricao, desconto, validade },
      token,
    }),
  validar: (codigo: string, id_usuario: number) =>
    request('/cupons/validar', {
      method: 'POST',
      body: { codigo, id_usuario },
    }),
  utilizar: (codigo: string, id_usuario: number) =>
    request('/cupons/utilizar', {
      method: 'POST',
      body: { codigo, id_usuario },
    }),
  delete: (id: number, token?: string) =>
    request(`/cupons/${id}`, { method: 'DELETE', token }),
};

// Marketplace/Anúncios
export const marketplaceAPI = {
  getAll: () => request('/marketplace'),
  create: (data: any) => request('/marketplace', { method: 'POST', body: data }),
  update: (id: number, data: any) =>
    request(`/marketplace/${id}`, { method: 'PATCH', body: data }),
  delete: (id: number) =>
    request(`/marketplace/${id}`, { method: 'DELETE' }),
};

// Conversas
export const conversasAPI = {
  getAll: () => request('/conversas'),
  getById: (id: number) => request(`/conversas/${id}`),
  getByUser: (id_usuario: number) =>
    request(`/conversas/usuario/${id_usuario}`),
  create: (participantes: number[]) =>
    request('/conversas', { method: 'POST', body: { participantes } }),
  delete: (id: number) =>
    request(`/conversas/${id}`, { method: 'DELETE' }),
};

// Mensagens
export const mensagensAPI = {
  getByConversa: (id_conversa: number) =>
    request(`/mensagens/conversa/${id_conversa}`),
  getById: (id: number) => request(`/mensagens/${id}`),
  create: (id_conversa: number, id_remetente: number, conteudo: string) =>
    request('/mensagens', {
      method: 'POST',
      body: { id_conversa, id_remetente, conteudo },
    }),
  markAsRead: (id: number) =>
    request(`/mensagens/${id}/lida`, { method: 'PATCH' }),
  delete: (id: number) =>
    request(`/mensagens/${id}`, { method: 'DELETE' }),
};

// Notificações
export const notificacoesAPI = {
  getByUser: (id_usuario: number) =>
    request(`/notificacoes/usuario/${id_usuario}`),
  getUnreadByUser: (id_usuario: number) =>
    request(`/notificacoes/usuario/${id_usuario}/nao-lidas`),
  create: (id_usuario: number, tipo: string, titulo: string, descricao: string) =>
    request('/notificacoes', {
      method: 'POST',
      body: { id_usuario, tipo, titulo, descricao },
    }),
  markAsRead: (id: number) =>
    request(`/notificacoes/${id}/lida`, { method: 'PATCH' }),
  markAllAsRead: (id_usuario: number) =>
    request(`/notificacoes/usuario/${id_usuario}/lidas`, { method: 'PATCH' }),
  delete: (id: number) =>
    request(`/notificacoes/${id}`, { method: 'DELETE' }),
};
