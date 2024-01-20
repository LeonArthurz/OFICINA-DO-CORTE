// EFEITOS ÚTEIS DO SAGA
import { all, takeLatest, call, put } from 'redux-saga/effects';
// AÇÕES COM O BANCO
import { updateAgendamento } from './actions';
// IMPORTAÇÃO DOS TIPOS DE AÇÕES
import types from './types';
// IMPORTAÇÃO DO SERVICES API
import api from '../../../services/api';
// INFORMAÇÕES DO SALÃO
import consts from '../../../consts';

// FUNÇÃO RESPONSÁVEL POR FAZER A REQUISIÇÃO DOS AGENDAMENTOS
export function* filterAgendamento({start, end}) {
    try{
        // REQUISIÇÃO ATRAVÉS DO SAGA
        const {data: res} = yield call(api.post, '/agendamento/filter',{
            "salaoId": consts.salaoId,
            "periodo": {
                  "inicio": start,
                  "final": end,
              }
      });

        if (res.error){
            alert(res.message);
            return false;
        }

        yield put(updateAgendamento(res.agendamentos));
    
    } catch (err) {
        alert(err.message);
    }
}

// TAKELATEST ESCUTA A ACTION E EXECUTA A FUNÇÃO DE FILTRO
export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);