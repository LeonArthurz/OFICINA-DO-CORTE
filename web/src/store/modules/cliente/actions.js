import types from './types';

// FUNÇÃO P/ OBTER TODOS OS CLIENTES
export function allClientes() {
    return { type: types.ALL_CLIENTES };
}

// FUNÇÃO UTILIZADA PARA ATUALIZAR O ESTADO DO CLIENTE
export function updateCliente(payload) {
    return { type: types.UPDATE_CLIENTE, payload };
}

// FUNÇÃO PARA FILTRAR OS CLIENTES
export function filterClientes() {
    return { type: types.FILTER_CLIENTES };
}

// FUNÇÃO PARA ADICIONAR NOVO CLIENTE
export function addCliente() {
    return { type: types.ADD_CLIENTE };
}

// FUNÇÃO PARA REDEFINIR O ESTADO DO CLIENTE
export function resetCliente() {
    return { type: types.RESET_CLIENTE };
}

// FUNÇÃO P/ REMOVER VÍNCULO DO CLIENTE
export function unlinkCliente() {
    return { type: types.UNLINK_CLIENTE };
}