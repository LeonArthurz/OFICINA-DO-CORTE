// MONGOOSE P/ OTIMIZAR CONEXÃO COM O BANCO
const mongoose = require('mongoose');
const URI = 'mongodb+srv://leonarthur:teste123@cluster0.7y3gei7.mongodb.net/oficina-do-corte?retryWrites=true&w=majority';

mongoose
  .connect(URI, {})
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.error('Erro de conexão com o MongoDB:', err));

