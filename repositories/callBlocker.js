const { getCurrentTime } = require('./currentTime');

const blockCall = async (call) => {
    try {
        console.log(`[${getCurrentTime()}] Recebendo chamada...`);
        if (call) {
            await call.reject();
            console.log(`[${getCurrentTime()}] Chamada rejeitada`);
        }
    } catch (error) {
        console.error(`[${getCurrentTime()}] Erro ao rejeitar a chamada:`, error);
    }
};

module.exports = { blockCall };
