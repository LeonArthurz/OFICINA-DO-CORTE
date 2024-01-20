// IMMER P/ ATUALIZAR O ESTADO DE MANEIRA IMUTÁVEL
import { produce } from 'immer';
import types from './types';

// ESTADO INICIAL DO MÓDULO HORÁRIOS
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
    horarios: [],
    horario: {
        dias: [],
        inicio: '',
        fim: '',
        especialidades: [],
        colaboradores: [],
    },
};

// REDUCER P/ O MÓDULO DOS HORARIOS
function horario(state = INITIAL_STATE, action) {
    switch (action.type) {
        // AÇÃO P/ ATUALIZAR O ESTADO DO HORARIO
        case types.UPDATE_HORARIO: {
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }
        // AÇÃO P/ REDEFINIR O ESTADO DO HORARIO
        case types.RESET_HORARIO: {
            return produce(state, (draft) => {
                draft.horario = INITIAL_STATE.horario;
                return draft;
            });
        }
        default:
            return state;
    }
}

export default horario;