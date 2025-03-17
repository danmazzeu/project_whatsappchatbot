const blockCall = async (call) => {
    try {
        console.log('Recebendo chamada...');
        if (call) {
            await call.reject();
            console.log('Chamada rejeitada');
        }
    } catch (error) {
        console.error('Erro ao rejeitar a chamada:', error);
    }
};

module.exports = { blockCall };
