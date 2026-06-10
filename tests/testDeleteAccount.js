const API = process.env.API_URL || 'http://localhost:5000';

async function req(path, opts = {}) {
  const res = await fetch(API + path, opts);
  const body = await res.text().then(text => {
    try { return JSON.parse(text); } catch { return text; }
  });
  return { status: res.status, ok: res.ok, body };
}

(async () => {
  try {
    console.log('\n📝 === TESTE DE DELETE DE CONTA ===\n');

    // 1. Criar um usuário de teste
    console.log('1️⃣ Criando usuário de teste...');
    const createRes = await req('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test Delete User',
        email: `test-delete-${Date.now()}@example.com`,
        senha: 'password123',
        confirmar_senha: 'password123'
      })
    });

    if (!createRes.ok) {
      console.error('❌ Erro ao criar usuário:', createRes.body);
      process.exit(1);
    }

    const testUser = createRes.body;
    console.log(`✅ Usuário criado com ID: ${testUser.id_usuario}`);

    // 2. Fazer login para obter token
    console.log('\n2️⃣ Fazendo login...');
    const loginRes = await req('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        senha: 'password123'
      })
    });

    if (!loginRes.ok) {
      console.error('❌ Erro ao fazer login:', loginRes.body);
      process.exit(1);
    }

    const token = loginRes.body.token;
    console.log(`✅ Login bem-sucedido. Token: ${token.substring(0, 20)}...`);

    // 3. Verificar que o usuário existe
    console.log('\n3️⃣ Verificando que usuário existe...');
    const getRes = await req(`/users/${testUser.id_usuario}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!getRes.ok) {
      console.error('❌ Erro ao buscar usuário:', getRes.body);
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${getRes.body.nome}`);

    // 4. Deletar a conta
    console.log('\n4️⃣ Deletando conta...');
    const deleteRes = await req(`/users/${testUser.id_usuario}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!deleteRes.ok) {
      console.error('❌ Erro ao deletar usuário:', deleteRes.body);
      process.exit(1);
    }

    console.log(`✅ Conta deletada: ${deleteRes.body.message}`);

    // 5. Verificar que o usuário foi deletado
    console.log('\n5️⃣ Verificando se usuário foi realmente deletado...');
    const verifyRes = await req(`/users/${testUser.id_usuario}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (verifyRes.ok) {
      console.error('❌ ERRO: Usuário ainda existe após delete!');
      process.exit(1);
    } else if (verifyRes.status === 404 || !verifyRes.ok) {
      console.log(`✅ Usuário foi permanentemente deletado do banco de dados`);
    }

    console.log('\n✨ === TESTE FINALIZADO COM SUCESSO ===\n');

  } catch (err) {
    console.error('❌ Erro:', err);
    process.exit(1);
  }
})();
