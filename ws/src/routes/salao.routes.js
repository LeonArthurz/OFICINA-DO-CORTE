const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const turf = require('@turf/turf');


// FUNÇÃO ADD SALÃO
router.post('/', async (req, res) => {
    try {

        const salao = await new Salao(req.body).save();
        res.json({ salao })

    } catch (err) {
        res.json({ error: true, message: err.message})
    }
});

// FUNÇÃO GET PARA SABER OS SERVIÇOS DISPONÍVEIS
router.get('/servicos/:salaoId', async (req, res) => {
    try{
        const { salaoId } = req.params;
        const servicos = await Servico.find({
            salaoId,
            status: 'A'
        }).select('_id titulo');

        /* [{ label: 'Serviço', value: '1232313321' }] */
        
        res.json({
            servicos: servicos.map(s => ({ label: s.titulo, value: s._id }))
        });

    } catch (err) {
        res.json({ error: true, message: err.message})
    }
});

// FUNÇÃO GET 
router.get('/:id', async (req, res) => {
    try {
        const salao = await Salao.findById(req.params.id).select(
            'capa nome endereco.cidade geo.coordinates telefone'
        );

        // DISTÂNCIA
        const distance = turf.distance(
            turf.point(salao.geo.coordinates),
            turf.point([-30.043858, -51.103487]) // COORDENADAS DE POA, FALTA ATUALIZAR O FRONT
        );

        res.json({ error: false, salao, distance });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;
