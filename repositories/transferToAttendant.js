const { getCurrentTime } = require('./currentTime');

const attendants = [
    { name: 'Carol', number: '5511999999999' },
    { name: 'Ana', number: '5511888888888' },
    { name: 'Lucas', number: '5511777777777' }
];

const transferToAttendant = (message) => {
    const randomIndex = Math.floor(Math.random() * attendants.length);
    const attendant = attendants[randomIndex];
    const whatsappLink = `https://wa.me/${attendant.number}`;
    console.log(`[${getCurrentTime()}] Cliente transferido para atendente ${attendant.name}.`);
    message.reply(`Você será transferido para *${attendant.name}*. Clique no link abaixo para iniciar a conversa:\n${whatsappLink}`);
};

module.exports = { attendants, transferToAttendant };
