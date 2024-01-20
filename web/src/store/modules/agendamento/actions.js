// FUNÇÕES DAS AÇÕES
import types from './types';

export function filterAgendamento(start, end){
    return {
        type: types.FILTER_AGENDAMENTOS,
        start,
        end,
    };
}

export function updateAgendamento(agendamentos){
    return {
        type: types.UPDATE_AGENDAMENTO, agendamentos };
}