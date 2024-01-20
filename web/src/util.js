// FORMATAÇÃO DE TEMPO
const utilFunctions = {
    hourToMinutes: (hourMinute) => {
        const [hour, minutes] = hourMinute.split(':');
        return parseInt(hour) * 60 + parseInt(minutes);
    },
};

export default utilFunctions;