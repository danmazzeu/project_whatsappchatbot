const reactToMessage = async (message) => {
    try {
        await message.react('✅');
    } catch (error) {
        console.error('Erro ao reagir à mensagem:', error);
    }
};

module.exports = {
    reactToMessage,
};
