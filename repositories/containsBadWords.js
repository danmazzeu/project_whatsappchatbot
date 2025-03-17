const { getCurrentTime } = require('./currentTime');
const { logMessageToFile } = require('./logHandler');

const badWords = [
    'merda', 'caralho', 'porra', 'puta', 'vagabundo', 'bosta', 'desgraça', 
    'filho da puta', 'imbecil', 'idiota', 'otário', 'cuzão', 'escroto', 'safado', 
    'viado', 'lésbica', 'pau no cu', 'arrombado', 'fodido', 'porcaria', 'merdão',
    'desgraçado', 'porcaria', 'cabelo de cuia', 'buceta', 'fodão', 'cacete', 
    'puta que pariu', 'cacete', 'bosta', 'piranha', 'moleque', 'viado da peste'
];

let insultCount = {};

const checkAndHandleBadWords = async (message, client) => {
    const msgLower = message.body.toLowerCase();

    if (badWords.some((badWord) => msgLower.includes(badWord))) {
        const userId = message.from;

        if (!insultCount[userId]) {
            insultCount[userId] = 0;
        }

        insultCount[userId]++;

        if (insultCount[userId] === 3) {
            message.reply('Você foi bloqueado por utilizar palavras ofensivas repetidamente.');
            await client.getContactById(userId).then(contact => contact.block());
            console.log(`[${getCurrentTime()}] Usuário ${userId} bloqueado por insultos.`);
            logMessageToFile(`[${getCurrentTime()}] Usuário ${userId} bloqueado por insultos.`);
            return true;
        } else if (insultCount[userId] < 3) {
            message.reply(`Aviso: Você utilizou palavras ofensivas. Você tem ${3 - insultCount[userId]} avisos restantes antes de ser bloqueado.`);
            console.log(`[${getCurrentTime()}] Alerta de insulto enviado para ${userId}.`);
            logMessageToFile(`[${getCurrentTime()}] Alerta de insulto enviado para ${userId}.`);
            return false;
        }
    }
    return false;
};

module.exports = checkAndHandleBadWords;
