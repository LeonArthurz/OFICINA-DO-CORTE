const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/relationship/salaoCliente');
const moment = require('moment');


// CRIAR NOVO CLIENTE
router.post('/', async (req, res) => {
    const db = mongoose.connection;
    const session = await db.startSession();
    session.startTransaction();
    
    try {
        const { salaoId, nome, telefone, email, senha, foto, dataNascimento, sexo, dataCadastro, status } = req.body;
        let newCliente = null;
    
        const cliente = {
            nome,
            telefone,
            email,
            senha,
            foto,
            dataNascimento,
            sexo,
            dataCadastro,
            status,
            salaoId
        };
        // VERIFICAR SE O CLIENTE JÁ EXISTE
        const existentClient = await Cliente.findOne({
            $or: [
                { email: cliente.email },
                { telefone: cliente.telefone },
            ],
        });
        
        // SE NÃO EXISTER, CRIAR
        if (!existentClient) {
        newClient = await new Cliente({
            ...cliente,
        }).save({ session });
        }
    
        const clienteId = existentClient ? existentClient._id : newClient._id;

        // VERIFICAR SE EXITE O RELACIONAMENTO SALAOCLIENTE
        const existentRelationship = await SalaoCliente.findOne({
        salaoId,
        clienteId,
        });

        // CASO NÃO EXISTA    
        if (!existentRelationship) {
        await new SalaoCliente({
            salaoId,
            clienteId,
        }).save({ session });
        }
        
        if (existentRelationship && existentRelationship.status === 'I') {
        await SalaoCliente.findOneAndUpdate(
            {
            salaoId,
            clienteId,
            },
            { status: 'A' },
            { session }
        );
        }
    
        await session.commitTransaction();
        session.endSession();
    
        if (
        existentRelationship &&
        existentRelationship.status === 'A' &&
        existentClient
        ) {
        res.json({ error: true, message: 'Cliente já cadastrado!' });
        } else {
        res.json({ error: false });
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message });
    }
    });
          
// FILTRO
router.post('/filter', async (req, res) =>{
    try{
        const salaoClientes = await SalaoCliente.find({

        })
        const clientes = await Cliente.find(req.body.filters);
        res.json({error: false, clientes});
    }   catch (err){
        res.json({error:true, message: err.message})
    }
})

// PEGAR TODOS CLIENTES DE UM DETERMINADO SALAOID
router.get('/salao/:salaoId', async (req, res) => {
    try {
      const { salaoId } = req.params;
  
      
      const clientes = await SalaoCliente.find({
        salaoId,
        status: { $ne: 'E' },
      })
        .populate('clienteId')
        .select('clienteId dataCadastro status');

        console.log(clientes);
   
      res.json({
        error: false,
        clientes: clientes.map((vinculo) => ({
          ...vinculo.clienteId._doc,
          vinculoId: vinculo._id,
          dataCadastro: moment(vinculo.dataCadastro).format('DD/MM/YYYY'),
          status: vinculo.status,
        })),
      });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

// DELETAR
router.delete('/vinculo/:id', async (req, res) => {
    try {
        await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'E' });
        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
    });




module.exports = router;
