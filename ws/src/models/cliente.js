const mongoose = require('mongoose');    
const Schema = mongoose.Schema;

const cliente = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório.'],
    },
    telefone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: false,
    },
    foto: {
        type: String,
        required: false,
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I'],
        default: 'A',
    },
    salaoId: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model('Cliente', cliente);