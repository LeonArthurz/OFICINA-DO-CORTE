// IMPORTAÇÃO DA TABELA DE COLABORADORES
import 'rsuite/dist/styles/rsuite-default.css';
import Table from '../../components/Table';
import { Button, Drawer, Modal, Icon, TagPicker } from 'rsuite';
import { useEffect } from 'react';
import { allColaboradores, updateColaborador, filterColaboradores, addColaborador, unlinkColaborador, allServicos, saveColaborador, resetColaborador } from '../../store/modules/colaborador/actions';
import { useDispatch, useSelector } from 'react-redux';


const Colaboradores = () => {

    const dispatch = useDispatch();
    const { colaboradores, colaborador, behavior, form, components, servicos } = useSelector((state) => state.colaborador);

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO COMPONENTE
    const setComponent = (component, state) => {
        dispatch(
            updateColaborador({
                components: { ...components, [component]: state },
            })
        );
    };

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO OBJETO COLABORADOR
    const setColaborador = (key, value) => {
        dispatch(
            updateColaborador({
                colaborador: { ...colaborador, [key]: value },
            })
        );
    }

    // FUNÇÃO PARA SALVAR NOVO COLABORADOR NO BOTÃO DO DRAWER
    const save = () => {
        if (behavior === 'create') {
            dispatch(addColaborador());
          } else {
            dispatch(saveColaborador());
          }
        };


    // FUNÇÃO PARA REMOVER COLABORADOR NA MODAL
    const remove = () => {
        dispatch(unlinkColaborador());
        setComponent('confirmDelete', false);
    };

    // EFEITO PARA CARREGAR TODOS OS COLABORADORES AO MONTAR O COMPONENTE
    useEffect(() => {
        dispatch(allColaboradores());
        dispatch(allServicos());
    }, []);
    

    return (
        <div className="col p-5 overflow-auto h-100">

            {/* DRAWER PARA CRIAR OU ATUALIZAR COLABORADOR */}
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} Colaborador</h3>
                    <div className="row mt-3">
                        <div className="form-group col-12 mb-3">

                            <b>E-mail</b>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="E-mail do colaborador"
                                    value={colaborador.email}
                                    onChange={(e) => { setColaborador('email', e.target.value) }}
                                ></input>
                                {behavior === 'create' && (
                                    <div className="input-group-append">
                                        <Button
                                            appearance='primary'
                                            loading={form.filtering}
                                            disabled={form.filtering}
                                            onClick={() => {
                                                dispatch(
                                                    filterColaboradores());
                                            }}
                                        >
                                            Pesquisar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CAMPO DE FILTRO COM OS DADOS DO COLABORADOR */}
                        <div className="form-group col-6 mt-3">
                            <b className="">Nome</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome do Colaborador"
                                value={colaborador.nome}
                                onChange={(e) => setColaborador('nome', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6 mt-3">
                            <b className="">Status</b>
                            <select
                                className="form-control"
                                disabled={form.disabled && behavior === 'create'}
                                value={colaborador.vinculo}
                                onChange={(e) => setColaborador('vinculo', e.target.value)}
                            >
                                <option value="A">Ativo</option>
                                <option value="I">Inativo</option>
                            </select>
                        </div>

                        <div className="form-group col-6 mt-3">
                            <b className="">Telefone / Whatsapp</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Telefone / Whatsapp do Colaborador"
                                value={colaborador.telefone}
                                onChange={(e) => setColaborador('telefone', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6 mt-3">
                            <b className="">Data de Nascimento</b>
                            <input
                                type="date"
                                className="form-control"
                                value={colaborador.dataNascimento}
                                onChange={(e) => setColaborador('dataNascimento', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6 mt-3">
                            <b>Sexo</b>
                            <select
                                className="form-control"
                                value={colaborador.sexo}
                                onChange={(e) => setColaborador('sexo', e.target.value)}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                        <div className='col-12 mt-3'>
                            <b>Especialidades</b>
                            <TagPicker
                                size="lg"
                                block
                                data={servicos}
                                value={colaborador.especialidades}
                                onChange={(especialidade) => setColaborador('especialidades', especialidade)}
                                placeholder="Selecionar"
                            /> 
                        </div>
                    </div>

                    {/* BOTÃO PARA SALVAR OU REMOVER COLABORADOR */}
                    <Button
                        loading={form.saving}
                        color={behavior === 'create' ? 'green' : 'primary'}
                        size="lg"
                        block
                        onClick={() => save()}
                        className="mt-3"
                    >
                        {behavior === 'create' ? 'Salvar' : 'Atualizar'} Colaborador
                    </Button>
                    {behavior === 'update' && (
                        <Button
                            loading={form.saving}
                            color="red"
                            size="lg"
                            block
                            onClick={() => setComponent('confirmDelete', true)}
                            className="mt-1"
                        >
                            Remover Colaborador
                        </Button>)}
                </Drawer.Body>
            </Drawer>

            {/* JANELA PARA CONFIRMAR A "EXCLUSÃO" DO COLABORADOR */}
            <Modal
                show={components.confirmDelete}
                onHide={() => setComponent('confirmDelete', false)}
                size="xs"
            >
                <Modal.Body>
                    <Icon
                        icon="remind"
                        style={{
                            color: '#ffb300',
                            fontSize: 24,
                        }}
                    />
                    {'  '} Tem certeza que deseja excluir? Essa ação será irreversível!
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={form.saving} onClick={() => remove()} color="red">
                        Sim, tenho certeza!
                    </Button>
                    <Button
                        onClick={() => setComponent('confirmDelete', false)}
                        appearance="subtle"
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* TABELA DE COLABORADORES */}
            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Colaboradores</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    dispatch(resetColaborador())
                                    dispatch(updateColaborador({
                                        behavior: 'create',
                                    }))
                                    setComponent('drawer', true)
                                }}
                            >
                                <span className="mdi mdi-plus">Novo Colaborador</span>
                            </button>
                        </div>
                    </div>

                    {/* CONFIGURAÇÃO DA TABELA DE COLABORADORES */}
                    <Table
                        loading={form.filtering}
                        data={colaboradores}
                        config={[
                            { label: 'Nome', key: 'nome', width: 200, fixed: true },
                            { label: 'Email', key: 'email', width: 200 },
                            { label: 'Telefone', key: 'telefone', width: 200 },
                            {
                                label: 'Sexo',
                                content: (colaborador) => colaborador.sexo === "M" ? "Masculino" : "Feminino",
                                width: 200
                            },
                            { 
                                label: 'Status', 
                                key: 'vinculo', 
                                content: (colaborador) => colaborador.vinculo === "A" ? "Ativo" : "Inativo",
                                width: 200 
                            },
                            { label: 'Data Cadastro', key: 'dataCadastro', width: 200 },
                        ]}
                        actions={(colaborador) => (
                            <Button color="blue" size="xs">
                                Ver informações
                            </Button>
                        )}
                        // FUNÇÃO PARA MOSTRAR OS DADOS DO COLABORADOR NO DRAWER QUANDO CLICADO
                        onRowClick={(colaborador) => {                            
                            dispatch(updateColaborador({
                                behavior: 'update',
                            }))
                            dispatch(
                                updateColaborador({
                                    colaborador,
                                })
                            );
                            setComponent('drawer', true);
                        }}
                    />

                </div>
            </div>
        </div>
    );
};

export default Colaboradores;