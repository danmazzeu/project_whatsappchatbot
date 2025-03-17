const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { getCurrentTime } = require('./currentTime');

const saveQrCode = (qr) => {
    const qrCodeFolder = path.join(__dirname, '..', 'qrcode');

    if (!fs.existsSync(qrCodeFolder)) {
        fs.mkdirSync(qrCodeFolder);
        console.log(`[${getCurrentTime()}] Diretório ${qrCodeFolder} criado.`);
    }

    const qrFilePath = path.join(qrCodeFolder, 'qrcode.png');

    if (fs.existsSync(qrFilePath)) {
        fs.unlinkSync(qrFilePath);
        console.log(`[${getCurrentTime()}] QR Code antigo removido.`);
    }

    QRCode.toFile(qrFilePath, qr, { type: 'png' }, (err) => {
        if (err) {
            console.error(`[${getCurrentTime()}] Erro ao salvar o QR Code:`, err);
        } else {
            console.log(`[${getCurrentTime()}] QR Code salvo em: ${qrFilePath}`);
        }
    });
};

module.exports = { saveQrCode };
