import types from './types';

// FUNÇÃO P/ OBTER TODOS OS SERVICOS
export function allServicos() {
    return { type: types.ALL_SERVICOS };
}

// FUNÇÃO UTILIZADA PARA ATUALIZAR O ESTADO DO SERVICO
export function updateServico(payload) {
    return { type: types.UPDATE_SERVICO, payload };
}

// FUNÇÃO PARA ADICIONAR NOVO SERVICO
export function addServico() {
    return { type: types.ADD_SERVICO };
}

// FUNÇÃO PARA REDEFINIR O ESTADO DO SERVICO
export function resetServico() {
    return { type: types.RESET_SERVICO };
}

// FUNÇÃO P/ REMOVER VÍNCULO DO SERVICO
export function removeServico() {
    return { type: types.REMOVE_SERVICO };
}

// FUNÇÃO P/ REMOVER ARQUIVO AWS DO SERVICO
export function removeArquivo(key) {
    return { type: types.REMOVE_ARQUIVO, key };
}

export function saveServico() {
    return { type: types.SAVE_SERVICO };
  }