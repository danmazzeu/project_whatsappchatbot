const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

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

// Função para iniciar o bot e gerar o QR Code
const startBot = () => {
    const client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('qr', (qr) => {
        console.log('Escaneie este QR Code para conectar-se ao WhatsApp');
        saveQrCode(qr);
    });

    client.on('ready', () => {
        console.log('Chatbot WhatsApp está rodando!');
    });

    client.on('message', async (message) => {
        console.log(`Mensagem recebida: ${message.body}`);
        // Lógica de processamento de mensagens
    });

    client.initialize().catch(err => {
        console.error('Erro ao inicializar o cliente:', err);
    });
};

// Express setup
const app = express();

// Rota para gerar um novo QR Code
app.get('/', (req, res) => {
    console.log("Novo acesso recebido. Gerando novo QR Code...");
    // Garantir que o bot seja iniciado para gerar um novo QR Code
    startBot();
    res.send('Novo QR Code gerado. Escaneie o código para se conectar.');
});

// Use environment variable for port
const port = process.env.PORT || 3000; // Porta do Railway ou 3000

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
