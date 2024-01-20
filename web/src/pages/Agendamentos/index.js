// DISPARADOR DA AÇÃO
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// IMPORTAÇÃO DO CALENDÁRIO
import { Calendar, momentLocalizer } from 'react-big-calendar';
// P/ TRABALHAR COM O TEMPO
import moment from 'moment';
// IMPORTAÇÃO P/ CALENDÁRIO
import 'react-big-calendar/lib/css/react-big-calendar.css'
// FUNÇÃO P/ AÇÕES
import { filterAgendamento } from '../../store/modules/agendamento/actions';
// FORMATAÇÃO DE TEMPO
import util from '../../util';


// PASSANDO PRO CALENDÁRIO O MOMENT
const localizer = momentLocalizer(moment);


const Agendamentos = () => {
    // CRIAR UM EVENTO PARA DISPARAR TODA VEZ QUE ABRIR A TELA DE AGENDAMENTOS
    const dispatch = useDispatch();    
    const { agendamentos } = useSelector((state) => state.agendamento);

    // FORMATAÇÃO DOS AGENDAMENTOS
    const formatEventos = agendamentos.map((agendamento) => ({
        title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
        start: moment(agendamento.data).toDate(),
        end: moment(agendamento.data).add(util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm')), 'minutes').toDate(),
    }));

    // CONFIGURAÇÃO DO RANGE PARA EXTRAIR O PERÍODO NO CALENDÁRIO
    const formatRange = (periodo) => {
        let finalRange = {};
        if (Array.isArray(periodo)) {
            finalRange = {
                start: moment(periodo[0]).format('YYYY-MM-DD'),
                end: moment(periodo[periodo.length -1]).format('YYYY-MM-DD'),
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
        dispatch(
            filterAgendamento(
                moment().weekday(0).format('YYYY-MM-DD'),
                moment().weekday(6).format('YYYY-MM-DD')
            )
        );
    }, [dispatch]); 

    // PERSONALIZANDO A TELA DE AGENDAMENTOS COM O BIG CALENDAR
    return (
        <div className="col p-5 overflow-auto h-100">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4 mt-0">Agendamentos</h2>
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
                        style={{height:600}}
                    />
                </div>
            </div>
        </div>
        
    );
}

export default Agendamentos;