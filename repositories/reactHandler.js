const { getCurrentTime } = require('./currentTime');

const reactToMessage = async (message) => {
    try {
        await message.react('✅');
        console.log(`[${getCurrentTime()}] Chatbot reagiu a mensagem do cliente.`);
    } catch (error) {
        console.log(`[${getCurrentTime()}] Erro ao reagir à mensagem:`, error);
    }
};

module.exports = {
    reactToMessage,
};