const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const express = require('express');

const { blockCall } = require('./repositories/callBlocker');
const { reactToMessage } = require('./repositories/reactHandler');
const sendMedia = require('./repositories/sendMedia');
const { transferToAttendant } = require('./repositories/transferToAttendant');
const checkAndHandleBadWords = require('./repositories/containsBadWords');

// Função para salvar o QR Code
const saveQrCode = (qr) => {
    const qrCodeFolder = path.join(__dirname, 'qrcode');
    if (!fs.existsSync(qrCodeFolder)) {
        fs.mkdirSync(qrCodeFolder);
    }

    const qrFilePath = path.join(qrCodeFolder, 'qrcode.png');

    // Verificar se o arquivo QR já existe e removê-lo antes de criar um novo
    if (fs.existsSync(qrFilePath)) {
        fs.unlinkSync(qrFilePath); // Remove o arquivo existente
    }

    QRCode.toFile(qrFilePath, qr, { type: 'png' }, (err) => {
        if (err) {
            console.error('Erro ao salvar o QR Code:', err);
        } else {
            console.log(`QR Code salvo em: ${qrFilePath}`);
        }
    });
};

// Função para limpar pastas de sessões anteriores
const clearOldFolders = () => {
    const foldersToDelete = [
        path.join(__dirname, './.wwebjs_auth'),
        path.join(__dirname, './app/qrcode'),
        path.join(__dirname, './.wwebjs_cache')
    ];

    foldersToDelete.forEach((folder) => {
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    });
};

// Função para iniciar o bot
const startBot = () => {
    clearOldFolders();

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('Escaneie este QR Code para conectar-se ao WhatsApp');
        saveQrCode(qr);
    });

    client.on('ready', () => {
        console.log('Chatbot WhatsApp está rodando!');
    });

    client.on('message', async (message) => {
        try {
            console.log(`Mensagem recebida: ${message.body}`);

            // Verificar e lidar com palavras ofensivas
            const isBlocked = await checkAndHandleBadWords(message, client);
            if (isBlocked) {
                return;
            }

            // Reagir a todas as mensagens
            await reactToMessage(message);

            const msg = message.body.trim().toLowerCase();

            switch (msg) {
                case '1':
                    message.reply(`Opção selecionada: *[ 1 ]* Suporte franquia\nEscolha uma opção:\n
*[ 1.1 ]* Vídeos tutoriais
*[ 1.2 ]* Documentação PDF
*[ 1.3 ]* Treinamento
*[ 1.4 ]* Falar com atendente`);
                    break;
            
                case '1.1':
                    message.reply(`Você escolheu *[ 1.1 ]* Vídeos tutoriais.\nAqui estão alguns vídeos tutoriais que podem te ajudar:\n
- Como utilizar o sistema de forma eficiente.
- Como integrar a ferramenta com outros sistemas.`);
                    break;
            
                case '1.2':
                    await sendMedia(message, 'tutorial.pdf', client);
                    break;
            
                case '1.3':
                    message.reply(`Você escolheu *[ 1.3 ]* Treinamento.\nPara agendar um treinamento, entre em contato com nosso suporte.`);
                    break;
            
                case '1.4':
                    transferToAttendant(message);
                    break;
            
                case '2':
                    message.reply(`Opção selecionada: *[ 2 ]* Suporte maquininha\nEscolha uma opção:\n
*[ 2.1 ]* Como usar?
*[ 2.2 ]* Configurações avançadas
*[ 2.3 ]* Falar com atendente`);
                    break;
            
                case '2.1':
                    message.reply(`Você escolheu *[ 2.1 ]* Como usar?\nPara começar, siga as instruções no manual que acompanha a maquininha ou assista ao vídeo tutorial.`);
                    break;
            
                case '2.2':
                    message.reply(`Você escolheu *[ 2.2 ]* Configurações avançadas.\nPara acessar configurações avançadas, consulte o manual ou fale com nosso suporte.`);
                    break;
            
                case '2.3':
                    transferToAttendant(message);
                    break;
            
                case '3':
                    message.reply(`Opção selecionada: *[ 3 ]* Suporte ERP\nEscolha uma opção:\n
*[ 3.1 ]* FAQ ERP
*[ 3.2 ]* Contatar Suporte ERP
*[ 3.3 ]* Falar com atendente`);
                    break;
            
                case '3.1':
                    message.reply(`Você escolheu *[ 3.1 ]* FAQ ERP.\nAqui estão as perguntas mais frequentes:\n
- Como configurar o ERP?
- Como realizar backups no ERP?`);
                    break;
            
                case '3.2':
                    message.reply(`Você pode entrar em contato com o suporte ERP através dos seguintes canais:
*Email*: suporte@erp.com.br
*Telefone*: (XX) XXXX-XXXX`);
                    break;
            
                case '3.3':
                    transferToAttendant(message);
                    break;
            
                case '4':
                    message.reply(`Opção selecionada: *[ 4 ]* Suporte migração\nEscolha uma opção:\n
*[ 4.1 ]* Como migrar?
*[ 4.2 ]* Documentação
*[ 4.3 ]* Falar com atendente`);
                    break;
            
                case '4.1':
                    message.reply(`Você escolheu *[ 4.1 ]* Como migrar?\nA migração é feita em etapas. Entre em contato com nosso suporte para guiar o processo.`);
                    break;
            
                case '4.2':
                    await sendMedia(message, 'documentacao_migracao.pdf', client);
                    break;
            
                case '4.3':
                    transferToAttendant(message);
                    break;
            
                case '5':
                    transferToAttendant(message);
                    break;
            
                case '6':
                    message.reply(`Opção selecionada: *[ 6 ]* Suporte geral\nEscolha uma opção:\n
*[ 6.1 ]* Como resetar a senha
*[ 6.2 ]* Reportar um problema
*[ 6.3 ]* Falar com atendente`);
                    break;
            
                case '6.1':
                    message.reply(`Você escolheu *[ 6.1 ]* Como resetar a senha.\nPara resetar sua senha, clique em 'Esqueci minha senha' na tela de login.`);
                    break;
            
                case '6.2':
                    message.reply(`Você escolheu *[ 6.2 ]* Reportar um problema.\nSe você está enfrentando algum problema, envie uma descrição detalhada para que possamos te ajudar.`);
                    break;
            
                case '6.3':
                    transferToAttendant(message);
                    break;
            
                default:
                    message.reply(`Bem-vindo ao atendimento automatizado *LLI9*, selecione uma das opções:\n
*[ 1 ]* Suporte franquia
*[ 2 ]* Suporte maquininha
*[ 3 ]* Suporte ERP
*[ 4 ]* Suporte migração
*[ 5 ]* Falar com atendente
*[ 6 ]* Suporte geral`);
                    break;
            }            
        } catch (err) {
            console.error('Erro ao processar a mensagem:', err);
        }
    });

    // Bloqueador de chamadas
    client.on('call', async (call) => {
        blockCall(call);
    });

    client.initialize().catch(err => {
        console.error('Erro ao inicializar o cliente:', err);
    });
};

// Criação do servidor Express
const app = express();

// Endpoint para iniciar o bot via requisição GET
app.get('/', (req, res) => {
    startBot();
    res.send('Bot iniciado com sucesso!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
