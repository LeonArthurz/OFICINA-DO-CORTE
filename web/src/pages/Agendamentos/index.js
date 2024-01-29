// DISPARADOR DA AÇÃO
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
// IMPORTAÇÃO DO CALENDÁRIO
import { Calendar, momentLocalizer } from 'react-big-calendar';
// IMPORTAÇÃO DRAWER
// eslint-disable-next-line no-unused-vars
import { Drawer, Button, DatePicker, SelectPicker, InputNumber, Modal, Icon } from 'rsuite';
// P/ TRABALHAR COM O TEMPO
import moment from 'moment';
import 'moment/locale/pt-br';
// IMPORTAÇÃO P/ CALENDÁRIO
import 'react-big-calendar/lib/css/react-big-calendar.css'
// FUNÇÃO P/ AÇÕES
// eslint-disable-next-line no-unused-vars
import { filterAgendamento } from '../../store/modules/agendamento/actions';
import { allHorarios, updateHorario } from '../../store/modules/horario/actions';
// FORMATAÇÃO DE TEMPO
import util from '../../util';

moment.locale('pt-br');


// PASSANDO PRO CALENDÁRIO O MOMENT
const localizer = momentLocalizer(moment);


const Agendamentos = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState('');

    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState('');

    const [valorSelecionado, setValorSelecionado] = useState('');

    const [dataSelecionada, setDataSelecionada] = useState('');

    const [horarioSelecionado, setHorarioSelecionado] = useState('');

    const [dataHoraFormatada, setDataHoraFormatada] = useState('');


    const [colaboradores, setColaboradores] = useState([]);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');

    // CRIAR UM EVENTO PARA DISPARAR TODA VEZ QUE ABRIR A TELA DE AGENDAMENTOS
    const dispatch = useDispatch();
    const { agendamentos, form, behavior } = useSelector((state) => state.agendamento);
    const { horarios } = useSelector((state) => state.horario);

    // FORMATAÇÃO DOS AGENDAMENTOS
    const formatEventos = agendamentos && Array.isArray(agendamentos)
        ? agendamentos.map((agendamento) => {
            const { servicoId, clienteId, colaboradorId } = agendamento;
            if (servicoId && clienteId && colaboradorId) {
                return {
                    title: `${servicoId.titulo} - ${clienteId.nome} - ${colaboradorId.nome}`,
                    start: moment(agendamento.data).toDate(),
                    end: moment(agendamento.data).add(util.hourToMinutes(moment(servicoId.duracao).format('HH:mm')), 'minutes').toDate(),
                };
            }
            return null;
        })
        : [];

    // CONFIGURAÇÃO DO RANGE PARA EXTRAIR O PERÍODO NO CALENDÁRIO
    const formatRange = (periodo) => {
        let finalRange = {};
        if (Array.isArray(periodo)) {
            finalRange = {
                start: moment(periodo[0]).format('YYYY-MM-DD'),
                end: moment(periodo[periodo.length - 1]).format('YYYY-MM-DD'),
            };
        } else {
            finalRange = {
                start: moment(periodo.start).format('YYYY-MM-DD'),
                end: moment(periodo.end).format('YYYY-MM-DD'),
            };
        }

        return finalRange;
    }
    

    // DISPARAR A AÇÃO DE ATUALIZAÇÃO TODA VEZ QUE O COMPONENTE FOR CARREGADO
    useEffect(() => {
        dispatch(allHorarios());
        dispatch(
            filterAgendamento(
                moment().weekday(0).format('YYYY-MM-DD'),
                moment().weekday(6).format('YYYY-MM-DD')
            )
        );
    }, [dispatch]);


    // BUSCAS NO BANCO
    useEffect(() => {
        //clientes
        axios.get('http://localhost:8000/cliente/salao/6550245f88edacea5bc90c02')
            .then(clientes => {
                setClientes(clientes.data.clientes)
            })
            .catch(error => {
                console.log(error("Erro ao buscar dados: ", error));
            });

        //servicos
        axios.get('http://localhost:8000/servico/salao/6550245f88edacea5bc90c02')
            .then(servicos => {
                setServicos(servicos.data.servicos)
            })
            .catch(error => {
                console.log('Erro ao buscar dados: ', error);
            });

        //colaboradores
        axios.get('http://localhost:8000/colaborador/salao/6550245f88edacea5bc90c02')
            .then(colaboradores => {
                setColaboradores(colaboradores.data.colaboradores)
            })
            .catch(error => {
                console.log('Erro ao buscar dados: ', error);
            });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [isIndisponivelModalOpen, setIsIndisponivelModalOpen] = useState(false);

    // VERIFICAR HORÁRIO DISPONÍVEL
    const isHorarioDisponivel = (dataHora, horarios) => {
        const dataHoraAgendamento = moment(dataHora);
        const diaAgendamento = dataHoraAgendamento.day();
        const horarioAgendamento = dataHoraAgendamento.format('HH:mm');

        // Verifica se há algum horário disponível para o dia e horário selecionados
        for (const horario of horarios) {
            if (horario.dias.includes(diaAgendamento)) {
                const inicioDisponivel = moment(horario.inicio).format('HH:mm');
                const fimDisponivel = moment(horario.fim).format('HH:mm');
    
                if (horarioAgendamento >= inicioDisponivel && horarioAgendamento <= fimDisponivel) {
                    return true; // Horário disponível encontrado
                }
            }
        }
        return false; // Nenhum horário disponível encontrado
    };


    // ENVIAR AGENDAMENTO P/ BACK-END
    const submitAgendamento = () => {
        // Verificar se o horário está disponível
        const horarioDisponivel = isHorarioDisponivel(dataHoraFormatada, horarios);

        if (horarioDisponivel) {
            // Horário disponível, realizar o agendamento
            axios.post('http://localhost:8000/agendamento', {
                clienteId: clienteSelecionado,
                salaoId: '6550245f88edacea5bc90c02',
                servicoId: servicoSelecionado,
                colaboradorId: colaboradorSelecionado,
                data: dataHoraFormatada,
                valor: valorSelecionado
            }).then(response => {
                    setIsModalOpen(true);
                    const horariosAtualizados = horarios.map(horario => {
                        if (horario.colaboradores.includes(colaboradorSelecionado)) {
                            return {
                                ...horario,
                                dias: horario.dias.filter(dia => dia !== moment(dataHoraFormatada).day()),
                            };
                        }
                        return horario;
                    });
                    dispatch(updateHorario(horariosAtualizados));
            }).catch(error => {
                console.log('Erro na requisição POST: ', error);
            });
        } else {
            // Horário não disponível
            setIsIndisponivelModalOpen(true);
        }
    };

    const optionsClientes = clientes.map(obj => ({
        label: obj.email,
        value: obj._id
    }));

    const optionsServicos = servicos.map(obj => ({
        label: obj.titulo,
        value: obj._id,
        preco: obj.preco
    }));

    const optionsColaboradores = colaboradores.map(obj => ({
        label: obj.nome,
        value: obj._id
    }));

    const handleServicoChange = value => {
        setServicoSelecionado(value);
        if (value !== null) {
            const selectedServico = servicos.find(obj => obj._id === value);
            setValorSelecionado(selectedServico.preco);
        } else {
            setValorSelecionado(null);
        }
    };

    // FUNÇÃO P/ AJUSTAR HORÁRIO
    useEffect(() => {
        function AjustarHorario() {
            const primeiraData = new Date(dataSelecionada)
            const segundaData = new Date(horarioSelecionado)

            const horaSegundaData = segundaData.getHours();
            const minutosSegundaData = segundaData.getMinutes();
            const segundosSegundaData = segundaData.getSeconds();

            primeiraData.setHours(horaSegundaData);
            primeiraData.setMinutes(minutosSegundaData);
            primeiraData.setSeconds(segundosSegundaData);

            const ano = primeiraData.getFullYear();
            const mes = (primeiraData.getMonth() + 1).toString().padStart(2, '0');
            const dia = primeiraData.getDate().toString().padStart(2, '0');
            const horaFormatada = horaSegundaData.toString().padStart(2, '0');
            const minutosFormatados = minutosSegundaData.toString().padStart(2, '0');
            const segundosFormatados = segundosSegundaData.toString().padStart(2, '0');

            setDataHoraFormatada(`${ano}-${mes}-${dia}T${horaFormatada}:${minutosFormatados}:${segundosFormatados}`);
        }
        AjustarHorario();
    }, [dataSelecionada, horarioSelecionado])

    // PERSONALIZANDO A TELA DE AGENDAMENTOS COM O BIG CALENDAR
    return (
        <div className="col p-5 overflow-auto h-100">
            <Modal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                size="xs"
            >
                <Modal.Body>
                    <Icon
                        icon="check-circle"
                        style={{
                            color: 'green',
                            fontSize: 30,
                        }}
                    />
                    {'  '} Agendamento realizado com sucesso!
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            setIsModalOpen(false);
                            window.location.reload();
                        }}
                        appearance="subtle"
                    >
                        Fechar
                    </Button>

                </Modal.Footer>
            </Modal>
            <Modal
                show={isIndisponivelModalOpen}
                onHide={() => setIsIndisponivelModalOpen(false)}
                size="xs"
            >
                <Modal.Body>
                    <Icon
                        icon="exclamation-circle"
                        style={{
                            color: 'red',
                            fontSize: 30,
                        }}
                    />
                    {'  '}Horário indisponível. Por favor, escolha outro horário.
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsIndisponivelModalOpen(false)} appearance="subtle">
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Drawer
                show={openDrawer}
                size="sm"
                onHide={() => setOpenDrawer(false)}
            >
                <Drawer.Body>
                    <h3>Marcar Agendamento</h3>
                    <div className="row mt-3">
                        <div className="col-12">
                            <b>E-mail do Cliente</b>
                            <SelectPicker
                                size="lg"
                                block
                                value={clienteSelecionado}
                                data={optionsClientes}
                                onChange={value => setClienteSelecionado(value)}
                                placeholder="Selecionar"
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <b>Serviços</b>
                            <SelectPicker
                                size="lg"
                                block
                                value={servicoSelecionado}
                                data={optionsServicos}
                                onChange={value => handleServicoChange(value)}
                                placeholder="Selecionar"
                            />
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            <b>Valor</b>
                            <InputNumber
                                size="lg"
                                block
                                value={valorSelecionado}
                                disabled={true}
                                placeholder="Selecionar"
                            />
                        </div>
                    </div>

                    <div className="col-6 mt-3">
                        <div className="d-block">Dia</div>
                        <DatePicker
                            oneTap
                            style={{ width: 200 }}
                            value={dataSelecionada}
                            onChange={value => setDataSelecionada(value)} />
                        <div />
                    </div>

                    <div className="col-6 mt-3">
                        <b className="d-block">Horário Inicial</b>
                        <DatePicker
                            block
                            format="HH:mm"
                            hideMinutes={(min) => ![0, 30].includes(min)}
                            value={horarioSelecionado}
                            onChange={value => setHorarioSelecionado(value)}
                        />
                    </div>

                    <div className="row mt-3 mt-3">
                        <div className="col-12">
                            <b className="">Colaboradores Disponíveis</b>
                            <SelectPicker
                                size="lg"
                                block
                                value={colaboradorSelecionado}
                                data={optionsColaboradores}
                                onChange={value => setColaboradorSelecionado(value)}
                                placeholder="Selecionar"
                            />
                        </div>
                    </div>

                    <Button
                        loading={form.saving}
                        color={behavior === 'create' ? 'green' : 'primary'}
                        size="lg"
                        block
                        onClick={() => submitAgendamento(clienteSelecionado, servicoSelecionado, colaboradorSelecionado, dataHoraFormatada, valorSelecionado)}
                        disabled={!clienteSelecionado || !servicoSelecionado || !colaboradorSelecionado || !horarioSelecionado ||
                            !dataSelecionada || !valorSelecionado}
                        className="mt-3"
                    >
                        Salvar Novo Agendamento
                    </Button>
                </Drawer.Body>
            </Drawer>

            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Agendamentos</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => setOpenDrawer(true)}
                            >
                                <span className="mdi mdi-plus">Novo Agendamento</span>
                            </button>
                        </div>
                    </div>
                    <Calendar
                        localizer={localizer}
                        onRangeChange={(periodo) => {
                            const { start, end } = formatRange(periodo)
                            dispatch(
                                filterAgendamento(start, end));
                        }}
                        events={formatEventos}
                        defaultView="week"
                        selectable={true}
                        popup
                        style={{ height: 600 }}
                    />
                </div>
            </div>
        </div>

    );
}

export default Agendamentos;