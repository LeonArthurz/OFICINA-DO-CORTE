const moment = require('moment');

module.exports = {

    // DURAÇÃO PADRÃO DE CADA INTERVALO DE AGENDAMENTO
    SLOT_DURATION: 30,

    // FUNÇÃO PARA CONVERTER HORAS E MINUTOS PARA MINUTOS
    hourToMinutes: (hourMinute) => {
        const [hour, minutes] = hourMinute.split(':');
        return parseInt(hour) * 60 + parseInt(minutes);
    },
    
    // FUNÇÃO PARA DIVIDIR UM INTERVALO DE TEMPO EM PARTES MENORES COM BASE NA DURAÇÃO
    sliceMinutes: (start, end, duration) => {
        const slices = [];
        let count = 0;

        start = moment(start);
        end = moment(end);
        
        while (end > start) {
            slices.push(start.format('HH:mm'));
            start = start.add(duration, 'minutes');
            count++;
        }

        return slices;
    },

    // FUNÇÃO PARA UNIR DATA E HORA EM UM FORMATO COMBINADO
    mergeDateTime: (date, time) => {
        const merged = `${moment(date).format('YYYY-MM-DD')}T${moment(time).format('HH:mm')}`;
        return merged;
    },
    
    // FUNÇÃO PARA DIVIDIR UM ARRAY COM BASE EM UM VALOR ESPECÍFICO
    splitByValue: (array, value) => {
        let newArray = [[]];
        array.forEach((item) => {
          if (item !== value) {
            newArray[newArray.length - 1].push(item);
          } else {
            newArray.push([]);
          }
        });
        return newArray;
    },
}
