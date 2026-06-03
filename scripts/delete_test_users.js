const API = process.env.API_URL || 'http://localhost:5000';

async function req(path, opts = {}){
  const res = await fetch(API + path, opts);
  const body = await res.json().catch(()=>null);
  return { status: res.status, body };
}

(async ()=>{
  try{
    console.log('Fetching users...');
    const r = await req('/users');
    if (!Array.isArray(r.body)) return console.error('Unexpected users response', r);

    const testUsers = r.body.filter(u => u.email && (u.email.includes('test1@') || u.email.includes('test2@') || u.email.startsWith('test')));
    if (testUsers.length === 0) return console.log('No test users found');

    for (const u of testUsers){
      console.log('Renaming (soft-delete) user', u.id_usuario, u.email);
      const newEmail = `deleted_${u.id_usuario}_${Date.now()}@example.com`;
      const newNome = `DELETED_USER_${u.id_usuario}`;
      const d = await req(`/users/${u.id_usuario}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: newNome, email: newEmail }) });
      console.log(d.status, d.body);
    }

    console.log('Done');
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
