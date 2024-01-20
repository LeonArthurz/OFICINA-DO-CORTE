const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const Agendamento = require('../models/agendamento');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Horario = require('../models/horario');
const Colaborador = require('../models/colaborador');
const util = require('../services/util');
const _ = require('lodash');
const horario = require('../models/horario');



// ADICIONAR HORÁRIO
router.post('/', async (req, res) => {
    try{

        const { clienteId, salaoId, servicoId, colaboradorId, data } = req.body;

        //FAZER VERIFICAÇÃO SE AINDA EXISTE HORÁRIO DISPONÍVEL
        const agendamentoExistente = await Agendamento.findOne({
            colaboradorId,
            data,            
        });

        if (agendamentoExistente) {
            return res.json({ error: true, message: 'Horário não disponível.' });
        }

        //RECUPERAR O CLIENTE
        const cliente = await Cliente.findById(clienteId).select('nome telefone');

        //RECUPERAR O SERVIÇO
        const servico = await Servico.findById(servicoId).select('preco titulo');

        //RECUPERAR O COLABORADOR
        const colaborador = await Colaborador.findById(colaboradorId).select('nome telefone');

        // PREÇO
        const precoFinal = (servico.preco);

        //CRIAR AGENDAMENTO
        const agendamento = await new Agendamento(req.body).save();

        res.json({ error: false, agendamento });
    } catch (err){
        res.json({ error: true, message: err.message });
    }
});

// FILTRAR AGENDAMENTOS DO SALÃO
router.post('/filter', async (req, res) =>{
    try{

        const { periodo , salaoId } = req.body;
        const agendamentos = await Agendamento.find({
            salaoId,
            data: {
                $gte: moment(periodo.inicio).startOf('day'),
                $lte: moment(periodo.final).endOf('day'),
            },
        }).populate([
            { path: 'servicoId', select: 'titulo duracao'},
            { path: 'colaboradorId', select: 'nome'},
            { path: 'clienteId', select: 'nome'}
        ]);
        
        res.json({ error: false, agendamentos });

    } catch (err) {
        res.json ({ error: true, message: err.message})
    }

})

// VERIFICAR A DISPONIBILIDADE DO SERVIÇO NAQUELE HORÁRIO DETERMINADO
router.post('/disponibilidade', async (req, res) => {
    try {
        const { data, salaoId, servicoId } = req.body;
        const horarios = await Horario.find({ salaoId });
        const servico = await Servico.findById(servicoId).select('duracao');

        let agenda = [];
        let lastDay = moment(data);
        let colaboradores = [];

        // DURAÇÃO DO SERVICO
        const servicoMinutos = util.hourToMinutes(moment(servico.duracao).format('HH:mm'));

        // CADA SLOT TEM 30 MINUTOS
        const servicoSlots = util.sliceMinutes(
            moment(servico.duracao),
            moment(servico.duracao).add(servicoMinutos, "minutes"),
            util.SLOT_DURATION, false
        ).length;

        // BUSCAR NOS PRÓXIMOS 365 DIAS ATÉ A AGENDA CONTER 7 DIAS DISPONÍVEIS
        for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
            const espacosValidos = horarios.filter(horario => {
                // VERIFICAR O DIA DA SEMANA
                const diaSemanaDisponivel = horario.dias.includes(moment(lastDay).day()); // [0,1,2,3,4,5,6]

                // VERIFICAR ESPECIALIDADE DISPONÍVEL
                const servicoDisponivel = horario.especialidades.includes(servicoId);

                return diaSemanaDisponivel && servicoDisponivel;
            });

            let todosHorariosDia = {};

            // TODOS OS COLABORADORES DISPONÍVEIS NO DIA E SEUS HORÁRIOS
            if (espacosValidos.length > 0) {
                for (let espaco of espacosValidos) {
                    for (let colaboradorId of espaco.colaboradores) {
                        if (!todosHorariosDia[colaboradorId]) {
                            todosHorariosDia[colaboradorId] = [];
                        }

                        // PEGAR TODOS OS HORÁRIOS DO ESPAÇO E JOGAR PRA DENTRO DO COLABORADOR
                        todosHorariosDia[colaboradorId] = [
                            ...(todosHorariosDia[colaboradorId] || []),
                            ...util.sliceMinutes(
                                util.mergeDateTime(lastDay, espaco.inicio),
                                util.mergeDateTime(lastDay, espaco.fim),
                                util.SLOT_DURATION
                            ),
                        ];
                    }
                }

                // OCUPAÇÃO DE CADA ESPECIALISTA NO DIA
                for (let colaboradorId of Object.keys(todosHorariosDia)) {
                    // RECUPERAR AGENDAMENTOS
                    const agendamentos = await Agendamento.find({
                        colaboradorId,
                        data: {
                            $gte: moment(lastDay).startOf('day'),
                            $lte: moment(lastDay).endOf('day'),
                        }
                    }).select('data servicoId -_id').populate('servicoId', 'duracao');

                    // RECUPERAR HORARIOS OCUPADOS
                    let horariosOcupados = agendamentos.map(agendamento => ({
                        inicio: moment(agendamento.data),
                        final: moment(agendamento.data).add(util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm')), 'minutes'),
                    }));

                    // RECUPERAR TODOS OS SLOTS ENTRE OS AGENDAMENTOS
                    horariosOcupados = horariosOcupados
                        .map(horario => util.sliceMinutes(
                            horario.inicio,
                            horario.final,
                            util.SLOT_DURATION)).flat();

                    // REMOVENDO TODOS OS HORARIOS / SLOTS OCUPADOS
                    let horariosLivres = util.splitByValue(todosHorariosDia[colaboradorId].map((horarioLivre) => {
                        return horariosOcupados.includes(horarioLivre)
                            ? '-'
                            : horarioLivre;
                    }), '-'
                    ).filter(space => space.length > 0);

                    // VERIFICANDO SE EXISTE ESPAÇO SUFICIENTE NO SLOT PARA O AGENDAMENTO
                    horariosLivres = horariosLivres.filter(horarios => horarios.length >= servicoSlots);

                    // VERIFICANDO SE O HORÁRIO ENCAIXA COM O HORÁRIO FINAL DO FECHAMENTO DA BARBER
                    horariosLivres = horariosLivres.map((slot) => slot.filter((horario, index) => 
                    slot.length - index >= servicoSlots)).flat();

                    // FORMATANDO HORÁRIOS DE 2 EM 2 P/ USAR NO FRONT
                    horariosLivres = _.chunk(horariosLivres, 2);

                    // REMOVER COLABORADOR CASO NÃO TENHA NENHUM ESPAÇO
                    if(horariosLivres.lenght == 0){
                        todosHorariosDia = _.omit(todosHorariosDia, colaboradorId);
                    } else {
                        todosHorariosDia[colaboradorId] = horariosLivres;
                    }
                    
                    // VERIFICAR SE TEM ESPECIALISTA DISPONIVEL NO DIA
                    const totalEspecialistas = Object.keys(todosHorariosDia).length;

                    if(totalEspecialistas > 0){
                        colaboradores.push(Object.keys(todosHorariosDia));
                        agenda.push({ [lastDay.format('YYYY-MM-DD')]: todosHorariosDia });
                    } 
                }               
            }
            lastDay = lastDay.add(1, 'day');
        }

        // RECUPERANDO DADOS DOS COLABORADORES
        colaboradores = _.uniq(colaboradores.flat());
        colaboradores = await Colaborador.find({
            _id: { $in: colaboradores },
        }).select('nome foto');

        colaboradores = colaboradores.map(c => ({
            ...c._doc,
            nome: c.nome.split(' ')[0]
        }))

        res.json({ error: false, colaboradores, agenda });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;
