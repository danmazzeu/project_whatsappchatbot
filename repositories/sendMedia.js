const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const { getCurrentTime } = require('./currentTime');
const { logMessageToFile } = require('./logHandler');

const sendMedia = async (message, fileName, client) => {
    try {
        const filePath = path.join(__dirname, '..', 'documents', fileName);
        console.log(`[${getCurrentTime()}] Verificando arquivo: ${filePath}`);
        logMessageToFile(`[${getCurrentTime()}] Verificando arquivo: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.log(`[${getCurrentTime()}] Arquivo não encontrado: ${filePath}`);
            logMessageToFile(`[${getCurrentTime()}] Arquivo não encontrado: ${filePath}`);
            message.reply('Desculpe, o arquivo solicitado não foi encontrado.');
            return;
        }

        const fileExtension = path.extname(fileName).toLowerCase();
        let caption = '';

        switch (fileExtension) {
            case '.pdf':
                caption = 'Aqui está o documento solicitado.';
                break;
            case '.mp3':
                caption = 'Aqui está o áudio solicitado.';
                break;
            case '.jpg':
            case '.jpeg':
            case '.png':
                caption = 'Aqui está a imagem solicitada.';
                break;
            default:
                caption = 'Aqui está o arquivo solicitado.';
                break;
        }

        console.log(`[${getCurrentTime()}] Enviando mídia para: ${message.from}, arquivo: ${fileName}`);
        logMessageToFile(`[${getCurrentTime()}] Enviando mídia para: ${message.from}, arquivo: ${fileName}`);
        const media = MessageMedia.fromFilePath(filePath);
        
        console.log(`[${getCurrentTime()}] Enviando mensagem com mídia: ${media}`);
        logMessageToFile(`[${getCurrentTime()}] Enviando mensagem com mídia para: ${message.from}`);

        await client.sendMessage(message.from, media, { caption });

        console.log(`[${getCurrentTime()}] Mídia enviada com sucesso para: ${message.from}`);
        logMessageToFile(`[${getCurrentTime()}] Mídia enviada com sucesso para: ${message.from}`);

    } catch (error) {
        console.error(`[${getCurrentTime()}] Erro ao enviar mídia:`, error);
        logMessageToFile(`[${getCurrentTime()}] Erro ao enviar mídia: ${error.message}`);
        message.reply('Ocorreu um erro ao tentar enviar o arquivo.');
    }
};

module.exports = sendMedia;
