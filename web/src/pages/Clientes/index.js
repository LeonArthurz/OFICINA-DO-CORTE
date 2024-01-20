// IMPORTAÇÃO DA TABELA DE CLIENTES
import 'rsuite/dist/styles/rsuite-default.css';
import Table from '../../components/Table';
import { Button, Drawer, Modal, Icon } from 'rsuite';
import { useEffect } from 'react';
import { allClientes, updateCliente, filterClientes, addCliente, unlinkCliente, resetCliente } from '../../store/modules/cliente/actions';
import { useDispatch, useSelector } from 'react-redux';


const Clientes = () => {

    const dispatch = useDispatch();
    const { clientes, cliente, behavior, form, components } = useSelector((state) => state.cliente);

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO COMPONENTE
    const setComponent = (component, state) => {
        dispatch(
            updateCliente({
            components: {...components, [component]: state },
            })
        );
    };

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO OBJETO CLIENTE
    const setCliente = (key, value) => {
        dispatch(
            updateCliente({
            cliente: {...cliente, [key]: value },
            })
        );
    }

    // FUNÇÃO PARA SALVAR NOVO CLIENTE NO BOTÃO DO DRAWER
    const save = () => {
        dispatch(addCliente());
      };

    // FUNÇÃO PARA REMOVER CLIENTE NA MODAL
    const remove = () => {
        dispatch(unlinkCliente());
    };
    
    // EFEITO PARA CARREGAR TODOS OS CLIENTES AO MONTAR O COMPONENTE
    useEffect(() => {
        dispatch(allClientes());
      }, []);

    return(
        <div className="col p-5 overflow-auto h-100">

            {/* DRAWER PARA CRIAR OU ATUALIZAR CLIENTE */}
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} cliente</h3>
                    <div className="row mt-3">
                    <div className="form-group col-12 mb-3">

                         {/* CAMPO DE PESQUISA POR EMAIL */}
                        <b>E-mail</b>
                        <div className="input-group">
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="E-mail do cliente"
                                disabled={behavior === "update"} 
                                value={cliente.email}
                                onChange={(e) => {setCliente('email', e.target.value)}}
                            ></input>
                            {behavior === "create" && (
                                <div className="input-group-append">
                                    <Button 
                                    appearance='primary' 
                                    loading={form.filtering} 
                                    disabled={form.filtering}
                                    onClick={() => dispatch(filterClientes())}
                                    >
                                        Pesquisar
                                    </Button>
                                </div>
                            )}
                            </div>
                        </div>

                            {/* CAMPO DE FILTRO COM OS DADOS DO CLIENTE */}
                            <div className="form-group col-6 mt-3">
                                <b className="">Nome</b>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome do Cliente"
                                    disabled={form.disabled}
                                    value={cliente.nome}
                                    onChange={(e) => setCliente('nome', e.target.value)}
                                />
                            </div>   
                            <div className="form-group col-6 mt-3">
                                <b className="">Telefone / Whatsapp</b>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefone / Whatsapp do Cliente"
                                    disabled={form.disabled}
                                    value={cliente.telefone}
                                    onChange={(e) => setCliente('telefone', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-6 mt-3">
                                <b className="">Data de Nascimento</b>
                                <input
                                    type="date"
                                    className="form-control"
                                    disabled={form.disabled}
                                    value={cliente.dataNascimento}
                                    onChange={(e) => setCliente('dataNascimento', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-6 mt-3">
                                <b>Sexo</b>
                                <select
                                    disabled={form.disabled}
                                    className="form-control"
                                    value={cliente.sexo}
                                    onChange={(e) => setCliente('sexo', e.target.value)}
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                    </div>

                    {/* BOTÃO PARA SALVAR OU REMOVER CLIENTE */}
                    <Button
                        block
                        className="mt-3"
                        color={behavior === 'create' ? 'green' : 'red'}
                        size="lg"
                        loading={form.saving}
                        onClick={() => {
                        if (behavior === 'create') {
                            save();
                        } else {
                            setComponent('confirmDelete', true);
                        }
                    }}>
                        {behavior === 'create' ? 'Salvar' : 'Remover'} Cliente
                    </Button>
                </Drawer.Body>
            </Drawer>

            {/* JANELA PARA CONFIRMAR A "EXCLUSÃO" DO CLIENTE */}
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

            {/* TABELA DE CLIENTES */}
            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                    <h2 className="mb-4 mt-0">Clientes</h2>
                    <div> 
                        <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => {
                            dispatch(resetCliente())
                            dispatch(updateCliente({
                                behavior: 'create',
                            }))
                            setComponent('drawer', true)
                        }}
                        >
                            <span className="mdi mdi-plus">Novo Cliente</span>
                        </button>
                    </div>
                    </div>

                    {/* CONFIGURAÇÃO DA TABELA DE CLIENTES */}
                    <Table 
                        loading={form.filtering}
                        data={clientes}
                        config={[
                            { label: 'Nome', key: 'nome', width: 200, fixed: true },
                            { label: 'Email', key: 'email', width: 200 },
                            { label: 'Telefone', key: 'telefone', width: 200 },
                            { 
                                label: 'Sexo', 
                                content: (cliente) => cliente.sexo === "M" ? "Masculino" : "Feminino", 
                                width: 200 
                            },
                            { label: 'Status', key: 'status' , width: 200 },
                            { label: 'Data Cadastro', key: 'dataCadastro', width: 200 },
                        ]}  
                        actions={(cliente) => (
                            <Button color="blue" size="xs">
                            Ver informações
                            </Button>
                        )} 
                        // FUNÇÃO PARA MOSTRAR OS DADOS DO CLIENTE NO DRAWER QUANDO CLICADO
                        onRowClick={(cliente) =>{
                            dispatch(updateCliente({
                                behavior: 'update',
                            }))
                            dispatch(
                                updateCliente({
                                    cliente,
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

export default Clientes;