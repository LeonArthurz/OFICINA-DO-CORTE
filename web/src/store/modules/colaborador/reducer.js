// IMMER P/ ATUALIZAR O ESTADO DE MANEIRA IMUTÁVEL
import { produce } from 'immer';
import types from './types';

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
    colaboradores: [],
    servicos: [],
    colaborador: {
        email: '',
        nome: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'M',
        vinculo: 'A',
        especialidades: [],
      },
  };

// REDUCER P/ O MÓDULO DE COLABORADORES
function colaborador(state = INITIAL_STATE, action) {
    switch (action.type) {
        // AÇÃO P/ ATUALIZAR O ESTADO DO COLABORADOR
        case types.UPDATE_COLABORADOR:{
            return produce(state, (draft) => {
                draft = {...draft, ...action.payload};
                return draft;
            });
        }
        // AÇÃO P/ REDEFINIR O ESTADO DO COLABORADOR
        case types.RESET_COLABORADOR:{
            console.log(action)
            return produce(state, (draft) => {
                draft.colaborador = INITIAL_STATE.colaborador;
                return draft;
            });
        }
        default:
            return state;
    }
}

export default colaborador;