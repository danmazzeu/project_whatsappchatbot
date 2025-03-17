const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

const sendMedia = async (message, fileName, client) => {
    try {
        const filePath = path.join(__dirname, '..', 'documents', fileName);
        console.log(`Verificando arquivo: ${filePath}`);

        if (!fs.existsSync(filePath)) {
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

        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(message.from, media, { caption });

    } catch (error) {
        console.error('Erro ao enviar mídia:', error);
        message.reply('Ocorreu um erro ao tentar enviar o arquivo.');
    }
};

module.exports = sendMedia;
