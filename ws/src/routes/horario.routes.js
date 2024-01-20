const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Horario = require('../models/horario')
const ColaboradorServico = require('../models/relationship/colaboradorServico');

// ADIONAR HORÁRIO
router.post('/', async (req, res) => {
    try {

        const horario = await new Horario(req.body).save();
        res.json({ horario })

    } catch (err) {
        res.json({ error: true, message: err.message});
    }
});

// EXTRAIR HORÁRIOS
router.get('/salao/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params;
        const horarios = await Horario.find({
            salaoId,
        });
        res.json({ horarios })

    } catch (err) {
        res.json({ error: true, message: err.message});
    }
});

// ATUALIZAR HORÁRIOS
router.put('/:horarioId', async (req, res) => {
    try {
        const { horarioId } = req.params;
        const horario = await Horario.findOneAndUpdate(
            { _id: horarioId }, req.body,{ new: true });

        res.json({ error: false, horario });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// DELETE
router.delete('/:horarioId', async (req, res) => {
    try {
        const { horarioId } = req.params;
        await Horario.findOneAndDelete(horarioId);

        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// EXTRAIR OS COLABORADORES PELO SERVICO
router.post('/colaboradores', async (req, res) => {
    try {
        const colaboradorServico = await ColaboradorServico.find({
            servicoId: { $in: req.body.especialidades },
            status: 'A'
        }).populate('colaboradorId', 'nome').select('colaboradorId -_id');

        const listaColaboradores = _.uniqBy(colaboradorServico, (vinculo) =>
        vinculo.colaboradorId._id.toString()
        ).map((vinculo) => ({
            label: vinculo.colaboradorId.nome,
            value: vinculo.colaboradorId._id
        }));
        
        res.json({ error: false, colaboradores: listaColaboradores });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});


module.exports = router;
