import types from './types';

// FUNÇÃO UTILIZADA PARA ATUALIZAR O ESTADO DO HORÁRIO
export function updateHorario(payload) {
    return { type: types.UPDATE_HORARIO, payload };
}

// FUNÇÃO PARA ADICIONAR NOVO HORÁRIO
export function addHorario() {
    return { type: types.ADD_HORARIO };
}

// FUNÇÃO PARA REDEFINIR O ESTADO DO HORÁRIO
export function resetHorario() {
    return { type: types.RESET_HORARIO };
}

// FUNÇÃO P/ OBTER TODOS OS HORARIOS 
export function allHorarios() {
    return { type: types.ALL_HORARIOS };
}

// FUNÇÃO P/ EXTRAIR TODOS SERVIÇOS
export function allServicos() {
    return { type: types.ALL_SERVICOS };
}

// FUNÇÃO P/ SALVAR OS HORÁRIOS
export function saveHorario() {
    return { type: types.SAVE_HORARIO };
  }

  // FUNÇÃO P/ REMOVER OS HORÁRIOS
export function removeHorario() {
    return { type: types.REMOVE_HORARIO };
  }
  
// FUNÇÃO PARA FILTRAR OS HORÁRIOS
export function filterColaboradores() {
    return { type: types.FILTER_COLABORADORES };
}