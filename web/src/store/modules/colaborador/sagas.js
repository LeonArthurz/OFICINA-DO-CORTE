import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateColaborador, allColaboradores as allColaboradoresAction, resetColaborador } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

// FUNÇÃO P/ EXTRAIR OS DADOS DO COLABORADOR
export function* allColaboradores() {

    const { form } = yield select((state) => state.colaborador);


    try {
        yield put(updateColaborador({ form: {...form, filtering: true }}));
        const { data:res } = yield call(api.get, `/colaborador/salao/${consts.salaoId}`);

        yield put(updateColaborador({ form: {...form, filtering: false }}));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateColaborador({ colaboradores: res.colaboradores} ));

    } catch (err) {
            yield put(updateColaborador({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO PARA FILTRAR OS COLABORADORES
export function* filterColaboradores() {

    const { form, colaborador } = yield select((state) => state.colaborador);


    try {
        yield put(updateColaborador({ form: {...form, filtering: true }}));
        const { data:res } = yield call(api.post, `/colaborador/filter`,
            { filters: {
                email: colaborador.email,
                status: 'A',
            }}
            );

        yield put(updateColaborador({ form: {...form, filtering: false }}));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        if (res.colaboradores.length > 0) {
            yield put(updateColaborador({ 
                colaborador: res.colaboradores[0],
                form: {...form, filtering: false, disabled: true }}));
        } else {
            yield put(updateColaborador({ form: {...form, disabled: false }}));
        }


        yield put(updateColaborador({ colaboradores: res.colaboradores} ));

    } catch (err) {
            yield put(updateColaborador({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO PARA ADICIONAR O COLABORADOR
export function* addColaboradores() {

    const { form, colaborador, components, behavior } = yield select((state) => state.colaborador);

    try {
        yield put(updateColaborador({ form: {...form, saving: true }}));
        let res = {};

        if (behavior === "create"){
            const response = yield call(api.post, `/colaborador`,{
                salaoId: consts.salaoId,
                nome: colaborador.nome,
                telefone: colaborador.telefone,
                email: colaborador.email,
                dataNascimento: colaborador.dataNascimento,
                sexo: colaborador.sexo,
                status: colaborador.vinculo,
                especialidades: colaborador.especialidades
            });
            res = response.data;
        } else {
            const response = yield call(api.put, `/colaborador/${colaborador._id}`,{
                vinculo: colaborador.vinculo,
                vinculoId: colaborador.vinculoId,
                especialidades: colaborador.especialidades,
            });
            res = response.data;
        }


        yield put(updateColaborador({ form: {...form, saving: false },            
        }));
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allColaboradoresAction());
        yield put(updateColaborador({ components: {...components, drawer: false }}));
        yield put(resetColaborador());

    } catch (err) {
            yield put(updateColaborador({ form: {...form, saving: false }}));
        alert(err.message);
    }
}
// FUNÇÃO PARA MUDAR STATUS SALAOCOLABORADOR 'E'
export function* unlinkColaborador() {

    const { form, colaborador, components } = yield select((state) => state.colaborador);

    try {
        yield put(updateColaborador({ form: {...form, saving: true }}));
        const { data:res } = yield call(api.delete, `/colaborador/vinculo/${colaborador.vinculoId}`);

        yield put(updateColaborador({ 
            form: {...form, saving: false },
            })
        );
    
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allColaboradoresAction());
        yield put(updateColaborador({ components: {...components, drawer: false, confirmeDelete: false }}));
        yield put(resetColaborador());

    } catch (err) {
        yield put(updateColaborador({ form: {...form, saving: false }}));
        alert(err.message);
    }
}
// FUNÇÃO GET P/ SERVIÇOS DO SALÃO
export function* allServicos(){
    const { form } = yield select((state) => state.colaborador);

    try {
        yield put(updateColaborador({ form: {...form, filtering: true }}));
        const { data:res } = yield call(
            api.get, 
            `/salao/servicos/${consts.salaoId}`);

        yield put(updateColaborador({ form: {...form, filtering: false }}));
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateColaborador({ servicos: res.servicos }));

    } catch (err) {
        yield put(updateColaborador({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}
// FUNÇÃO P/ SALVAR OS DADOS
export function* saveColaborador() {
    const { colaborador, form, components } = yield select(
      (state) => state.colaborador
    );
  
    try {
      yield put(updateColaborador({ form: { ...form, saving: true } }));
      const { vinculo, vinculoId, especialidades } = colaborador;
  
      const { data: res } = yield call(
        api.put,
        `/colaborador/${colaborador._id}`,
        { vinculo, vinculoId, especialidades }
      );
      yield put(updateColaborador({ form: { ...form, saving: false } }));
  
        if (res.error) {
            alert(res.message);
            return false;
        }
  
      yield put(allColaboradoresAction());
      yield put(updateColaborador({ components: { ...components, drawer: false } }));
      yield put(resetColaborador());
    } catch (err) {
        yield put(updateColaborador({ form: {...form, filtering: false }}));
        alert(err.message);
    }
}

export default all([
    takeLatest(types.ALL_COLABORADORES, allColaboradores),
    takeLatest(types.FILTER_COLABORADOR, filterColaboradores),
    takeLatest(types.UPDATE_COLABORADOR, updateColaborador),
    takeLatest(types.ADD_COLABORADOR, addColaboradores),
    takeLatest(types.UNLINK_COLABORADOR, unlinkColaborador),
    takeLatest(types.RESET_COLABORADOR, resetColaborador),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.SAVE_COLABORADOR, saveColaborador),
]);
