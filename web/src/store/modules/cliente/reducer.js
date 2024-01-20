// IMMER P/ ATUALIZAR O ESTADO DE MANEIRA IMUTÁVEL
import { produce } from 'immer';
import types from './types';

// ESTADO INICIAL DO MÓDULO CLIENTES
const INITIAL_STATE = {
    behavior: "create",
    components: {
        drawer: false,
        confirmDelete: false
    },
    form: {
        filtering: false,
        disabled: true,
        saving:false,
    },
    clientes: [],
    cliente: {
        email: '',
        nome: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'M'
      },
  };

// REDUCER P/ O MÓDULO DE CLIENTES
function cliente(state = INITIAL_STATE, action) {
    switch (action.type) {
        // AÇÃO P/ ATUALIZAR O ESTADO DO CLIENTE
        case types.UPDATE_CLIENTE:{
            return produce(state, (draft) => {
                draft = {...draft, ...action.payload};
                return draft;
            });
        }
        // AÇÃO P/ REDEFINIR O ESTADO DO CLIENTE
        case types.RESET_CLIENTE:{
            console.log(action)
            return produce(state, (draft) => {
                draft.cliente = INITIAL_STATE.cliente;
                return draft;
            });
        }
        default:
            return state;
    }
}

export default cliente;