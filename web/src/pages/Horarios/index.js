// DISPARADOR DA AÇÃO
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// IMPORTAÇÃO ACTIONS
import { allHorarios, allServicos, updateHorario, filterColaboradores, addHorario, saveHorario, resetHorario, removeHorario } from '../../store/modules/horario/actions';
// IMPORTAÇÃO DO CALENDÁRIO
import { Calendar, momentLocalizer } from 'react-big-calendar';
// IMPORTAÇÃO DRAWER
import { Drawer, TagPicker, DatePicker, Button, Modal, Icon } from 'rsuite';
// P/ TRABALHAR COM O TEMPO
import moment from 'moment';
// IMPORTAÇÃO ESTILOS CALENDÁRIO
import 'react-big-calendar/lib/css/react-big-calendar.css'
// P/ TRADUZIR OS CAMPOS
import 'moment/locale/pt-br'
moment.locale('pt-br')


// PASSANDO PRO CALENDÁRIO O MOMENT
const localizer = momentLocalizer(moment);


const Horarios = () => {

    const dispatch = useDispatch();
    const { horarios, form, behavior, servicos, colaboradores, horario, components } = useSelector((state) => state.horario);

    const diasDaSemana = [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado',
    ];

    const diasSemanaData = [
        new Date(2024, 1, 11, 0, 0, 0, 0),
        new Date(2024, 1, 12, 0, 0, 0, 0),
        new Date(2024, 1, 13, 0, 0, 0, 0),
        new Date(2024, 1, 14, 0, 0, 0, 0),
        new Date(2024, 1, 15, 0, 0, 0, 0),
        new Date(2024, 1, 16, 0, 0, 0, 0),
        new Date(2024, 1, 17, 0, 0, 0, 0),
    ];

    const formatEvents = horarios.map((horario, index) => horario.dias.map((dia) => ({
        resource: horario,
        title: `${horario.especialidades.length} espec. e ${horario.colaboradores.length} colab. disponíveis`,
        start: new Date(
            diasSemanaData[dia].setHours(
                parseInt(moment(horario.inicio).format('HH')),
                parseInt(moment(horario.inicio).format('mm'))
            )
        ),
        end: new Date(
            diasSemanaData[dia].setHours(
                parseInt(moment(horario.fim).format('HH')),
                parseInt(moment(horario.fim).format('mm'))
            )
        ),
    }))).flat();


    // FUNÇÃO PARA ATUALIZAR O ESTADO DO COMPONENTE
    const setComponent = (component, state) => {
        if (component === 'drawer' && state) {
            dispatch(filterColaboradores());
        }
        dispatch(
            updateHorario({
                components: { ...components, [component]: state },
            })
        );
    };

    // FUNÇÃO PARA ATUALIZAR O ESTADO DO OBJETO HORÁRIO
    const setHorario = (key, value) => {
        dispatch(
            updateHorario({
                horario: { ...horario, [key]: value },
            })
        );
    }

    // FUNÇÃO PARA SALVAR NOVO HORÁRIO NO BOTÃO DO DRAWER
    const save = () => {
        if (behavior === 'create') {
            dispatch(addHorario());
        } else {
            dispatch(saveHorario());
        }
    };
    // FUNÇÃO PARA EXCLUIR HORÁRIO
    const remove = () => {
        dispatch(removeHorario());
    };

    useEffect(() => {
        dispatch(allHorarios());
        dispatch(allServicos());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        dispatch(filterColaboradores());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [horario.especialidades]);


    // PERSONALIZANDO A TELA DE AGENDAMENTOS COM O BIG CALENDAR
    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer
                show={components.drawer}
                size="sm"
                onHide={() => setComponent('drawer', false)}
            >
                <Drawer.Body>
                    <h3>{behavior === "create" ? "Criar novo" : "Atualizar"} horário de atendimento</h3>
                    <div className="row mt-3">
                        <div className="col-12">
                            <b>Dias da semana</b>
                            <TagPicker
                                size="lg"
                                block
                                value={horario.dias}
                                data={diasDaSemana.map((label, value) => ({ label, value }))}
                                onChange={(value) => {
                                    setHorario('dias', value);
                                }}
                                placeholder="Selecionar"
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <b className="d-block">Horário Inicial</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={horario.inicio}
                                onChange={(e) => {
                                    setHorario('inicio', e);
                                }}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <b className="d-block">Horário Final</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={horario.fim}
                                onChange={(e) => {
                                    setHorario('fim', e);
                                }}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <b>Especialidades disponíveis</b>
                            <TagPicker
                                size="lg"
                                block
                                data={servicos}
                                value={horario.especialidades}
                                onChange={(e) => {
                                    setHorario('especialidades', e);
                                }}
                                placeholder="Selecionar"
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <b>Colaboradores disponíveis</b>
                            <TagPicker
                                size="lg"
                                block
                                data={colaboradores}
                                value={horario.colaboradores}
                                onChange={(e) => {
                                    setHorario('colaboradores', e);
                                }}
                                placeholder="Selecionar"
                            />
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
                        Salvar Horário de Atendimento
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
                            Remover Horário de Atendimento
                        </Button>
                    )}
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

            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Horários de Atendimento</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    dispatch(resetHorario())
                                    dispatch(updateHorario({
                                        behavior: 'create',
                                    }))
                                    setComponent('drawer', true)
                                }}
                            >
                                <span className="mdi mdi-plus">Novo Horário</span>
                            </button>
                        </div>
                    </div>
                    <Calendar
                        onSelectEvent={e => {
                            dispatch(updateHorario({
                                behavior: 'update',
                            }))
                            dispatch(
                                updateHorario({
                                    horario: e.resource,
                                })
                            );
                            setComponent('drawer', true);
                        }}
                        localizer={localizer}
                        toolbar={false}
                        formats={{
                            dateFormat: 'dd',
                            dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
                        }}
                        popup
                        selectable={true}
                        events={formatEvents}
                        date={diasSemanaData[moment().day()]}
                        view="week"
                        style={{ height: 600 }}
                    />
                </div>
            </div>
        </div>

    );

};

export default Horarios;