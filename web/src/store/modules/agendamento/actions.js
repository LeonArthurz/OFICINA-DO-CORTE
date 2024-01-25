// FUNÇÕES DAS AÇÕES
import types from './types';

// FUNÇÃO P/ FILTRAR OS AGENDAMENTOS
export function filterAgendamento(start, end){
    return {
        type: types.FILTER_AGENDAMENTOS,
        start,
        end,
    };
}
// FUNÇÃO P/ ATUALIZAR O AGENDAMENTO
export function updateAgendamento(agendamentos){
    return {
        type: types.UPDATE_AGENDAMENTO, agendamentos };
}
// FUNÇÃO PARA REDEFINIR O ESTADO DO AGENDAMENTO
export function resetAgendamento() {
    return { type: types.RESET_AGENDAMENTO };
}
// FUNÇÃO PARA ADICIONAR NOVO AGENDAMENTO
export function addAgendamento() {
    return { type: types.ADD_AGENDAMENTO };
}
// FUNÇÃO P/ EXTRAIR TODOS SERVIÇOS
export function allServicos() {
    return { type: types.ALL_SERVICOS };
}
// FUNÇÃO P/ SALVAR OS AGENDAMENTOS
export function saveAgendamento() {
    return { type: types.SAVE_AGENDAMENTO };
  }
// FUNÇÃO P/ REMOVER OS AGENDAMENTOS
export function removeAgendamento() {
    return { type: types.REMOVE_AGENDAMENTO };
  }