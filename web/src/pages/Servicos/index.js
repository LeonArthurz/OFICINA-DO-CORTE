// IMPORTAÇÃO DA TABELA DE SERVICOS
import 'rsuite/dist/styles/rsuite-default.css';
import Table from '../../components/Table';
import { Button, Drawer, Modal, Icon, DatePicker, Tag, Uploader } from 'rsuite';
import { useEffect } from 'react';
import { allServicos, updateServico, addServico, removeServico, saveServico, removeArquivo, resetServico } from '../../store/modules/servico/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import consts from '../../consts';


const Servicos = () => {

    const dispatch = useDispatch();
    const { servicos, servico, behavior, form, components } = useSelector((state) => state.servico);

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO COMPONENTE
    const setComponent = (component, state) => {
        dispatch(
            updateServico({
                components: { ...components, [component]: state },
            })
        );
    };

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO OBJETO SERVICO
    const setServico = (key, value) => {
        dispatch(
            updateServico({
                servico: { ...servico, [key]: value },
            })
        );
    }

    // FUNÇÃO PARA SALVAR NOVO SERVICO NO BOTÃO DO DRAWER
    const save = () => {
        if (behavior === 'create') {
            dispatch(addServico());
        } else {
            dispatch(saveServico());
        }
    };


    // FUNÇÃO PARA REMOVER SERVICO NA MODAL
    const remove = () => {
        dispatch(removeServico());
        window.location.reload();
    };

    // EFEITO PARA CARREGAR TODOS OS SERVICO AO MONTAR O COMPONENTE
    useEffect(() => {
        dispatch(allServicos());
    }, []);

    return (
        <div className="col p-5 overflow-auto h-100">

            {/* DRAWER PARA CRIAR OU ATUALIZAR SERVICO */}
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} Serviço</h3>
                    <div className="row mt-3">
                        <div className="form-group col-6 mt-3">
                            <b>Título</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Titulo do Serviço"
                                value={servico.titulo}
                                onChange={(e) => {
                                    setServico('titulo', e.target.value);
                                }}
                            />
                        </div>
                        <div className="form-group col-3 mt-3">
                            <b>R$ Preço</b>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Preço do serviço"
                                value={servico.preco}
                                onChange={(e) => setServico('preco', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3 mt-3">
                            <b>Recorr. (dias)</b>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Recorrência do Serviço"
                                value={servico.recorrencia}
                                onChange={(e) => setServico('recorrencia', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-4 mt-3">
                            <b className="d-block">Duração</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                value={servico.duracao}
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                onChange={(e) => {
                                    setServico('duracao', e);
                                }}
                            />
                        </div>
                        <div className="form-group col-4 mt-3">
                            <b>Status</b>
                            <select
                                className="form-control"
                                value={servico.status}
                                onChange={(e) => setServico('status', e.target.value)}
                            >
                                <option value="A">Ativo</option>
                                <option value="I">Inativo</option>
                            </select>
                        </div>
                        <div className="form-group col-12 mt-3">
                            <b className="">Descrição</b>
                            <textarea
                                rows="5"
                                className="form-control"
                                placeholder="Descrição do serviço..."
                                value={servico.descricao}
                                onChange={(e) => setServico('descricao', e.target.value)}
                            ></textarea>
                        </div>
                        <div className="form-group col-12 mt-3">
                            <b className="d-block">Imagens do serviço</b>
                            <Uploader
                                multiple
                                autoUpload={false}
                                listType='picture'
                                defaultFileList={servico.arquivos.map((servico, index) => ({
                                    name: servico?.caminho,
                                    fileKey: index,
                                    url: `${consts.bucketUrl}/${servico?.caminho}`
                                }))}
                                onChange={(files) => {
                                    const arquivos = files
                                        .filter((f) => f.blobFile)
                                        .map((f) => f.blobFile);
                                    setServico('arquivos', arquivos)
                                }}
                                onRemove={(file) => {
                                    if (behavior === 'update' && file.url) {
                                        dispatch(removeArquivo(file.name));
                                    }
                                }}
                            >
                                <button>
                                    <Icon icon="camera-retro" size="lg" />
                                </button>
                            </Uploader>
                        </div>
                    </div>
                    <Button
                        loading={form.saving}
                        color={behavior === 'create' ? 'green' : 'primary'}
                        size="lg"
                        block
                        onClick={() => save()}
                        className="mt-3"
                    >
                        {behavior === 'create' ? 'Salvar' : 'Atualizar'} Serviço
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
                            Remover Serviço
                        </Button>
                    )}
                </Drawer.Body>
            </Drawer>

            {/* JANELA PARA CONFIRMAR A "EXCLUSÃO" DO SERVICO */}
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

            {/* TABELA DE SERVICOS */}
            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Serviços</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    dispatch(resetServico())
                                    dispatch(updateServico({
                                        behavior: 'create',
                                    }))
                                    setComponent('drawer', true)
                                }}
                            >
                                <span className="mdi mdi-plus">Novo Serviço</span>
                            </button>
                        </div>
                    </div>

                    {/* CONFIGURAÇÃO DA TABELA DE SERVICO */}
                    <Table
                        loading={form.filtering}
                        data={servicos}
                        config={[
                            {
                                label: 'Titulo',
                                key: 'titulo',
                                fixed: true,
                                width: 200,
                            },
                            {
                                label: 'R$ Preço',
                                content: (servico) => `R$ ${servico.preco.toFixed(2)}`,
                            },
                            {
                                label: 'Recorrência (dias)',
                                content: (servico) => `${servico.recorrencia} dias`,
                            },
                            {
                                label: 'Duração',
                                key: 'duracao',
                                content: (servico) => moment(servico.duracao).format('HH:mm'),
                            },
                            {
                                label: 'Status',
                                key: 'status',
                                content: (servico) => (
                                    <Tag color={servico.status === 'A' ? 'green' : 'red'}>
                                        {servico.status === 'A' ? 'Ativo' : 'Inativo'}
                                    </Tag>
                                ),
                            },
                        ]}
                        actions={(servico) => (
                            <Button color="blue" size="xs">
                                Ver informações
                            </Button>
                        )}
                        // FUNÇÃO PARA MOSTRAR OS DADOS DO servico NO DRAWER QUANDO CLICADO
                        onRowClick={(servico) => {
                            dispatch(updateServico({
                                behavior: 'update',
                            }))
                            dispatch(
                                updateServico({
                                    servico,
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

export default Servicos;