const { getCurrentTime } = require('./currentTime');
const { logMessageToFile } = require('./logHandler');

const reactToMessage = async (message) => {
    try {
        await message.react('✅');
        console.log(`[${getCurrentTime()}] Chatbot reagiu a mensagem do cliente.`);
        logMessageToFile(`[${getCurrentTime()}] Chatbot reagiu a mensagem do cliente.`);
    } catch (error) {
        console.log(`[${getCurrentTime()}] Erro ao reagir à mensagem:`, error);
        logMessageToFile(`[${getCurrentTime()}] Erro ao reagir à mensagem: ${error.message}`);
    }
};

module.exports = {
    reactToMessage,
};
