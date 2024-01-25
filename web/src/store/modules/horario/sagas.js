import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateHorario, allHorarios as allHorariosAction, resetHorario } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

// FUNÇÃO P/ EXTRAIR OS DADOS DO COLABORADOR
export function* allHorarios() {

    const { form } = yield select((state) => state.horario);


    try {
        yield put(updateHorario({ form: {...form, filtering: true }}));
        const { data:res } = yield call(api.get, `/horario/salao/${consts.salaoId}`);

        yield put(updateHorario({ form: {...form, filtering: false }}));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateHorario({ horarios: res.horarios} ));

    } catch (err) {
            yield put(updateHorario({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO GET P/ SERVIÇOS DO SALÃO
export function* allServicos(){
    const { form } = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form: {...form, filtering: true }}));
        const { data:res } = yield call(
            api.get, 
            `/salao/servicos/${consts.salaoId}`);

        yield put(updateHorario({ form: {...form, filtering: false }}));
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateHorario({ servicos: res.servicos }));
    } catch (err) {
        yield put(updateHorario({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO PARA ADICIONAR O HORARIO
export function* addHorario() {

    const { form, horario, components, behavior } = yield select((state) => state.horario);


    try {
        yield put(updateHorario({ form: {...form, saving: true }}));
        let res = {};

        if (behavior === "create"){
            const response = yield call(api.post, `/horario`,{
                salaoId: consts.salaoId,
                ...horario
            });
            res = response.data;
        } else {
            const response = yield call(api.put, `/horario/${horario._id}`, horario);
            res = response.data;
        }


        yield put(updateHorario({ form: {...form, saving: false },            
        }));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allHorariosAction());
        yield put(updateHorario({ components: {...components, drawer: false }}));
        yield put(resetHorario());

    } catch (err) {
            yield put(updateHorario({ form: {...form, saving: false }}));
        alert(err.message);
    }
}
// FUNÇÃO PARA FILTRAR OS COLABORADORES
export function* filterColaboradores() {
    const { form, horario } = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form: { ...form, filtering: true } }));

        const { data: res } = yield call(
            api.post,
            `/horario/colaboradores/`,
            { especialidades: horario.especialidades }
        );

        yield put(updateHorario({ form: { ...form, filtering: false } }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateHorario({ colaboradores: res.colaboradores }));
    } catch (err) {
        yield put(updateHorario({ form: { ...form, filtering: false } }));
        alert(err.message);
    }
}

// FUNÇÃO P/ REMOVER OS HORÁRIOS
export function* removeHorario() {

    const { form, horario, components } = yield select((state) => state.horario);


    try {
        yield put(updateHorario({ form: {...form, filtering: true }}));
        const { data:res } = yield call(api.delete, `/horario/${horario._id}`);

        yield put(updateHorario({ form: {...form, filtering: false }}));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allHorariosAction());
        yield put(updateHorario({ components: {...components, drawer: false, confirmDelete: false }}));
        yield put(resetHorario());

    } catch (err) {
            yield put(updateHorario({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO P/ SALVAR OS DADOS
export function* saveHorario() {
    const { horario, form, components } = yield select(
      (state) => state.horario
    );
  
    try {
      yield put(updateHorario({ form: { ...form, saving: true } }));
  
      const { data: res } = yield call(
        api.put,
        `/horario/${horario._id}`,
        horario
      );
      yield put(updateHorario({ form: { ...form, saving: false } }));
  
        if (res.error) {
            alert(res.message);
            return false;
        }
  
      yield put(allHorariosAction());
      yield put(updateHorario({ components: { ...components, drawer: false } }));
      yield put(resetHorario());
    } catch (err) {
        yield put(updateHorario({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}

export default all([
    takeLatest(types.ALL_HORARIOS, allHorarios),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.ADD_HORARIO, addHorario),
    takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
    takeLatest(types.REMOVE_HORARIO, removeHorario),
    takeLatest(types.SAVE_HORARIO, saveHorario),
]);
