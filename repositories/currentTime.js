const getCurrentTime = () => {
    const date = new Date();
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    return date.toLocaleString('pt-BR', options);
};

module.exports = { getCurrentTime };
