const fs = require('fs');
const path = require('path');

const getCurrentTime = () => {
    const date = new Date();
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    return date.toLocaleString('pt-BR', options);
};

const logMessageToFile = (message) => {
    const logFilePath = path.join(__dirname, '..', 'log.txt');
    const logEntry = `[${getCurrentTime()}] Mensagem enviada para ${message.from}: ${message.body}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error(`[${getCurrentTime()}] Erro ao gravar no arquivo de log:`, err);
        } else {
            console.log(`[${getCurrentTime()}] Mensagem registrada no arquivo de log.`);
        }
    });
};

module.exports = { logMessageToFile };
