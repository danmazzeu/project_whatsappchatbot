const { Client, LocalAuth } = require('whatsapp-web.js');

// Repositórios
const { saveQrCode } = require('./repositories/qrCodeHandler');
const { clearOldFolders } = require('./repositories/folderCleaner');
const { logMessageToFile } = require('./repositories/logHandler');
const { getCurrentTime } = require('./repositories/currentTime');
const { blockCall } = require('./repositories/callBlocker');
const { reactToMessage } = require('./repositories/reactHandler');
const checkAndHandleBadWords = require('./repositories/containsBadWords');
const menuOptions = require('./repositories/menuOptions');

const startBot = () => {
    clearOldFolders();
    console.log(`[${getCurrentTime()}] Pastas antigas limpas.`);
    logMessageToFile(`[${getCurrentTime()}] Pastas antigas limpas.`);

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        const qrMessage = `[${getCurrentTime()}] Escaneie este QR Code para conectar-se ao WhatsApp`;
        console.log(qrMessage);
        logMessageToFile(qrMessage);
        saveQrCode(qr);
    });

    client.on('ready', () => {
        const readyMessage = `[${getCurrentTime()}] Chatbot WhatsApp está rodando!`;
        console.log(readyMessage);
        logMessageToFile(readyMessage);
    });

    client.on('call', async (call) => {
        const callMessage = `[${getCurrentTime()}] Chamada recebida, bloqueando...`;
        console.log(callMessage);
        logMessageToFile(callMessage);
        await blockCall(call);
    });

    client.on('message', async (message) => {
        try {
            const receivedMessage = `[${getCurrentTime()}] Mensagem recebida de ${message.from}: ${message.body}`;
            console.log(receivedMessage);
            logMessageToFile(receivedMessage);

            const isBlocked = await checkAndHandleBadWords(message, client);
            if (isBlocked) {
                const blockedMessage = `[${getCurrentTime()}] Mensagem bloqueada por conter palavras proibidas.`;
                console.log(blockedMessage);
                logMessageToFile(blockedMessage);
                return;
            }

            await reactToMessage(message);

            const msg = message.body.trim().toLowerCase();
            let resposta = '';

            if (menuOptions[msg]) {
                if (typeof menuOptions[msg] === 'function') {
                    menuOptions[msg](message, client);
                } else {
                    resposta = menuOptions[msg];
                }
            } else {
                resposta = menuOptions['default'];
            }

            if (resposta) {
                const responseMessage = `[${getCurrentTime()}] Enviando resposta: ${resposta}`;
                console.log(responseMessage);
                logMessageToFile(responseMessage);
                message.reply(resposta);
            }
        } catch (err) {
            const errorMessage = `[${getCurrentTime()}] Erro ao processar a mensagem: ${err}`;
            console.error(errorMessage);
            logMessageToFile(errorMessage);
        }
    });

    client.initialize().catch(err => {
        const errorInitializationMessage = `[${getCurrentTime()}] Erro ao inicializar o cliente: ${err}`;
        console.error(errorInitializationMessage);
        logMessageToFile(errorInitializationMessage);
    });
};

startBot();
