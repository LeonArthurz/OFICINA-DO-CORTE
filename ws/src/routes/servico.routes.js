const express = require('express');
const router = express.Router();
const busboy = require('connect-busboy'); 
const aws = require('../services/aws');
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');

/* ROTA RECEBE FORMDATA */
router.use(busboy());

// FUNÇÃO ADD NO BANCO DE DADOS
router.post('/', async (req, res) => {
    try {
        const { salaoId, servico } = req.body;
        let errors = [];
        let arquivos = [];

        if (req.files && Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                const file = req.files[key];

                const nameParts = file.name.split('.');
                const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
                const path = `servicos/${salaoId}/${fileName}`;

                const response = await aws.uploadToS3(file, path);

                if (response.error) {
                    errors.push({ error: true, message: response.message });
                } else {
                    arquivos.push(path);
                }
            }
        }

        if (errors.length > 0) {
            res.json(errors[0]);
            return false;
        }

        // CRIAR SERVIÇO
        let jsonServico = JSON.parse(servico);
        const servicoCadastrado = await Servico(jsonServico).save();

        // CRIAR ARQUIVO
        arquivos = arquivos.map(arquivo => ({
            referenciaId: servicoCadastrado._id,
            model: 'Servico',
            caminho: arquivo,
        }));

        await Arquivo.insertMany(arquivos);

        res.json({ servico: servicoCadastrado, arquivos });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// FUNÇÃO UPDATE 
router.put('/:id', async (req, res) => {
    try {
        const { salaoId, servico } = req.body;
        let errors = [];
        let arquivos = [];

        if (req.files && Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                const file = req.files[key];

                const nameParts = file.name.split('.');
                const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
                const path = `servicos/${salaoId}/${fileName}`;

                const response = await aws.uploadToS3(file, path);

                if (response.error) {
                    errors.push({ error: true, message: response.message });
                } else {
                    arquivos.push(path);
                }
            }
        }

        if (errors.length > 0) {
            res.json(errors[0]);
            return false;
        }

        // CRIAR SERVIÇO
        const jsonServico = JSON.parse(servico)
        await Servico.findByIdAndUpdate(req.params.id, jsonServico);

        // CRIAR ARQUIVO
        arquivos = arquivos.map(arquivo => ({
            referenciaId: req.params.id,
            model: 'Servico',
            caminho: arquivo,
        }));

        await Arquivo.insertMany(arquivos);

        res.json({ error: false });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// PARA O PAINEL PUXAR OS STATUS DIFERENTES DE EXCLUÍDOS
router.get('/salao/:salaoId', async (req, res) => {
    try {
    let servicosSalao = [];
    const servicos = await Servico.find({
        salaoId: req.params.salaoId,
        status: { $ne: 'E' },
    });

        for (let servico of servicos) {
            const arquivos = await Arquivo.find({
                model: 'Servico',
                referenciaId: servico._id
            });
            servicosSalao.push({...servico._doc, arquivos});
        }

        res.json({
            servicos: servicosSalao,
        });

     } catch (err) {
        res.json({ error: true, message: err.message });
     }
    
});
    
// FUNÇÃO PARA DELETAR ARQUIVOS NA AMAZON
router.post('/delete-arquivo', async (req, res) => {
    try {
        const { key } = req.body;

        // EXCLUIR AWS
        await aws.deleteFileS3(key);

        await Arquivo.findOneAndDelete({
            caminho: key,
        });

        res.json ({ error:false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// FUNÇÃO DELETE QUE ALTERA O STATUS DO SERVICO
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Servico.findByIdAndUpdate(id, { status: 'E'});

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;
