// IMMER P/ ATUALIZAR O ESTADO DE MANEIRA IMUTÁVEL
import { produce } from 'immer';
import types from './types';
import moment from 'moment';

// ESTADO INICIAL DO MÓDULO COLABORADORES
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
    servicos: [],
    servico: {
        titulo: '',
        preco: '',
        duracao: moment('00:30', 'HH:mm').format(),
        recorrencia: '',
        descricao: '',
        status: 'A',
        arquivos: [],
      },
  };

// REDUCER P/ O MÓDULO DE SERVICOS
function servico(state = INITIAL_STATE, action) {
    switch (action.type) {
        // AÇÃO P/ ATUALIZAR O ESTADO DO SERVICO
        case types.UPDATE_SERVICO:{
            return produce(state, (draft) => {
                draft = {...draft, ...action.payload};
                return draft;
            });
        }
        // AÇÃO P/ REDEFINIR O ESTADO DO SERVICO
        case types.RESET_SERVICO:{
            console.log(action)
            return produce(state, (draft) => {
                draft.servico = INITIAL_STATE.servico;
                return draft;
            });
        }
        default:
            return state;
    }
}

export default servico;