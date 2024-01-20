import types from './types';

// FUNÇÃO P/ OBTER TODOS OS COLABORADORES
export function allColaboradores() {
    return { type: types.ALL_COLABORADORES };
}

// FUNÇÃO UTILIZADA PARA ATUALIZAR O ESTADO DO COLABORADOR
export function updateColaborador(payload) {
    return { type: types.UPDATE_COLABORADOR, payload };
}

// FUNÇÃO PARA FILTRAR OS COLABORADORES
export function filterColaboradores() {
    return { type: types.FILTER_COLABORADOR };
}

// FUNÇÃO PARA ADICIONAR NOVO COLABORADOR
export function addColaborador() {
    return { type: types.ADD_COLABORADOR };
}

// FUNÇÃO PARA REDEFINIR O ESTADO DO COLABORADOR
export function resetColaborador() {
    return { type: types.RESET_COLABORADOR };
}

// FUNÇÃO P/ REMOVER VÍNCULO DO COLABORADOR
export function unlinkColaborador() {
    return { type: types.UNLINK_COLABORADOR };
}

// FUNÇÃO P/ EXTRAIR TODOS SERVIÇOS
export function allServicos() {
    return { type: types.ALL_SERVICOS };
}

// FUNÇÃO P/ SALVAR OS DADOS
export function saveColaborador() {
    return { type: types.SAVE_COLABORADOR };
  }