const API = process.env.API_URL || 'http://localhost:5000';

async function req(path, opts = {}){
  const res = await fetch(API + path, opts);
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch(e){}
  return { status: res.status, body };
}

(async ()=>{
  try{
    console.log('GET /users');
    let r = await req('/users');
    console.log(r.status, r.body);

    if (!Array.isArray(r.body) || r.body.length < 2){
      console.log('Creating test users...');
      const u1 = await req('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Test User 1', email: 'test1@example.com', senha: 'pass', confirmar_senha: 'pass' }) });
      console.log('create u1', u1.status, u1.body);
      const u2 = await req('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Test User 2', email: 'test2@example.com', senha: 'pass', confirmar_senha: 'pass' }) });
      console.log('create u2', u2.status, u2.body);
    }

    console.log('POST /conversas');
    let conv = await req('/conversas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ participantes: [1,2] }) });
    console.log(conv.status, conv.body);

    console.log('POST /mensagens');
    let msg = await req('/mensagens', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conversa: 1, id_remetente: 1, conteudo: 'Olá do script' }) });
    console.log(msg.status, msg.body);

    console.log('GET /mensagens/conversa/1');
    let msgs = await req('/mensagens/conversa/1');
    console.log(msgs.status, msgs.body);

  }catch(err){
    console.error('ERROR', err);
    process.exit(1);
  }
})();
