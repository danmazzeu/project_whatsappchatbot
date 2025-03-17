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

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log(`[${getCurrentTime()}] Escaneie este QR Code para conectar-se ao WhatsApp`);
        saveQrCode(qr);
    });

    client.on('ready', () => {
        console.log(`[${getCurrentTime()}] Chatbot WhatsApp está rodando!`);
    });

    client.on('call', async (call) => {
        console.log(`[${getCurrentTime()}] Chamada recebida, bloqueando...`);
        await blockCall(call);
    });

    client.on('message', async (message) => {
        try {
            console.log(`[${getCurrentTime()}] Mensagem recebida de ${message.from}: ${message.body}`);

            const isBlocked = await checkAndHandleBadWords(message, client);
            if (isBlocked) {
                console.log(`[${getCurrentTime()}] Mensagem bloqueada por conter palavras proibidas.`);
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
                console.log(`[${getCurrentTime()}] Enviando resposta: ${resposta}`);
                message.reply(resposta);
                logMessageToFile(message);
            }
        } catch (err) {
            console.error(`[${getCurrentTime()}] Erro ao processar a mensagem:`, err);
        }
    });

    client.initialize().catch(err => {
        console.error(`[${getCurrentTime()}] Erro ao inicializar o cliente:`, err);
    });
};

startBot();
