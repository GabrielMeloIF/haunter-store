//Melo aqui, criei o server.js fora do src para deixar o código (na minha concepção) mais organizado, os APPs vou colocar todos no 'app.js' dentro do src, e o server.js é só para rodar o servidor, então achei melhor deixar ele fora do src, mas se quiser posso colocar ele dentro do src sem problemas, é só me avisar

const express = require('express');
const app = express();

app.use(express.json());

app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});