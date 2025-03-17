const fs = require('fs');
const path = require('path');
const { getCurrentTime } = require('./currentTime');

const logMessageToFile = (message) => {
    if (typeof message === 'string') {
        const logEntry = `[${getCurrentTime()}] Mensagem: ${message}\n`;
        writeLogToFile(logEntry);
        return;
    }

    if (!message || typeof message !== 'object' || !message.from || !message.body) {
        console.error(`[${getCurrentTime()}] Erro: Mensagem incompleta (from ou body undefined ou mensagem não é um objeto)`);
        return;
    }

    const logEntry = `[${getCurrentTime()}] Mensagem recebida de ${message.from}: ${message.body}\n`;
    writeLogToFile(logEntry);
};

const writeLogToFile = (logEntry) => {
    const logFilePath = path.join(__dirname, '..', 'log.txt');
    console.log(`[${getCurrentTime()}] Caminho do arquivo de log: ${logFilePath}`);
    const logDir = path.dirname(logFilePath);
    
    if (!fs.existsSync(logDir)) {
        console.log(`[${getCurrentTime()}] Diretório não existe, criando diretório: ${logDir}`);
        try {
            fs.mkdirSync(logDir, { recursive: true });
        } catch (err) {
            console.error(`[${getCurrentTime()}] Erro ao criar diretório:`, err);
            return;
        }
    }

    try {
        fs.appendFileSync(logFilePath, logEntry);
        console.log(`[${getCurrentTime()}] Mensagem registrada no arquivo de log.`);
    } catch (err) {
        console.error(`[${getCurrentTime()}] Erro ao gravar no arquivo de log:`, err);
    }
};

module.exports = { logMessageToFile };
