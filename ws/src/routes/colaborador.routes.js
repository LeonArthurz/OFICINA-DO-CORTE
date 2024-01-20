const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Colaborador = require('../models/colaborador');
const SalaoColaborador = require('../models/relationship/salaoColaborador');
const ColaboradorServico = require('../models/relationship/colaboradorServico');
const moment = require('moment');

// ADICIONAR COLABORADOR
router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    console.log('req.body:', req.body);
    const { salaoId, nome, telefone, email, senha, foto, dataNascimento, sexo, dataCadastro, especialidades, vinculo } = req.body;
    let newColaborador = null;

    const colaborador = {
        nome,
        telefone,
        email,
        senha,
        foto,
        dataNascimento,
        sexo,
        dataCadastro,
        especialidades,
        vinculo
    };

    // Verificar se o colaborador já existe no banco de dados
    const existentColaborador = await Colaborador.findOne({
    $or: [
        { email: colaborador.email },
        { telefone: colaborador.telefone },
    ],
    });

    // Se o colaborador não existir, criar um novo
    if (!existentColaborador) {
    newColaborador = await new Colaborador(colaborador).save({ session });
    }

    // Obter o ID do colaborador
    const colaboradorId = existentColaborador
    ? existentColaborador._id
    : newColaborador._id;

    // Se existir um relacionamento, atualizar o status
    const existentRelationship = await SalaoColaborador.findOne({
    salaoId,
    colaboradorId,
    });

    // Criar SalaoColaborador
    if (!existentRelationship) {
    await new SalaoColaborador({
        salaoId,
        colaboradorId,
        status: colaborador.vinculo,
    }).save({ session });
    }

    if (existentRelationship && existentRelationship.status === 'I') {
    await SalaoColaborador.findOneAndUpdate(
        {
        salaoId,
        colaboradorId,
        },
        { status: 'A' },
        { session }
    );
    }

    // Inserir especialidades do colaborador 
    // await ColaboradorServico.insertMany(
    // colaborador.especialidades.map((servicoId) => ({
    //    servicoId,
    //    colaboradorId,
    //}))
    //);

    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentColaborador) {
    return res.json({ error: true, message: 'Colaborador já cadastrado!' });
    } else {
    return res.json({ error: false });
    }

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message });
    }
});

// UPDATE COLABORADOR
router.put('/:colaboradorId', async (req, res) => {
    try {
      const { vinculo, vinculoId, especialidades } = req.body;
      const { colaboradorId } = req.params;
  
      await Colaborador.findByIdAndUpdate(colaboradorId, req.body);
  
      if (vinculo) {
        await SalaoColaborador.findByIdAndUpdate(vinculoId, { status: vinculo });
      }
  
      if (especialidades) {
        await ColaboradorServico.deleteMany({
          colaboradorId,
        });
  
        await ColaboradorServico.insertMany(
          especialidades.map((servicoId) => ({
            servicoId,
            colaboradorId,
          }))
        );
      }
  
      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

//FILTRO PRA USAR NO FRONT
router.post('/filter', async (req, res) => {
  try {
    const colaboradores = await Colaborador.find(req.body.filters);
    res.json({ error: false, colaboradores });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// DELETAR COLABORADOR
router.delete('/vinculo/:id', async (req, res) => {
  try {
    await SalaoColaborador.findByIdAndUpdate(req.params.id, { status: 'E' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// GET PARA SABER OS COLABORADORES DO SALÃO
router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;
    let listaColaboradores = [];

    //RECUPERAR VINCULOS
    const salaoColaboradores = await SalaoColaborador.find({
      salaoId,
      status: { $ne: 'E' },
    })
      .populate({ path:'colaboradorId', select:'-senha -recipientId'})
      .select('colaboradorId dataCadastro status');

    for (let vinculo of salaoColaboradores) {
      const especialidades = await ColaboradorServico.find({
        colaboradorId: vinculo.colaboradorId._id,
      });
    
      listaColaboradores.push({
        ...vinculo._doc,
        especialidades: especialidades.map(
          (especialidade) => especialidade.servicoId).flat(),
      });
    }
      

    res.json({
      error: false,
      colaboradores: listaColaboradores.map((vinculo) => ({
        ...vinculo.colaboradorId._doc,
        vinculoId: vinculo._id,
        vinculo: vinculo.status,
        especialidades: vinculo.especialidades,
        dataCadastro: moment(vinculo.dataCadastro).format('DD/MM/YYYY'),
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
