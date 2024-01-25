import types from './types';

/* FUNÇÃO PARA AJUDAR NA ATUALIZAÇÃO DO STATE DE FORMA MAIS SIMPLES 
TRABALHA COM IMUTABILIDADE */
import { produce } from 'immer';

// ESTRUTURA DO REDUCER
const INITIAL_STATE = {
    behavior: "create",
    components: {
        drawer: false,
        confirmDelete: false,
        view: 'week'
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false,
    },
    colaboradores: [],
    servicos: [],
    agendamentos: [],
    agendamento: {
        dias: [],
        inicio: '',
        fim: '',
        especialidades: [],
        colaboradores: [],
    },
}

/* FUNÇÃO DO REDUCER PARA ESCUTAR O SAGAS E ATUALIZAR O STATE */
function agendamento(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_AGENDAMENTO: {
            return produce(state, (draft) =>{
                draft.agendamentos = action.agendamentos;
                return draft;
            })
        }
         // AÇÃO P/ REDEFINIR O ESTADO DO AGENDAMENTO
         case types.RESET_AGENDAMENTO: {
            return produce(state, (draft) => {
                draft.agendamentos = INITIAL_STATE.agendamentos;
                return draft;
            });
        }
        default:
            return state;
    }
}

export default agendamento;
