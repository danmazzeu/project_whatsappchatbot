const fs = require('fs');
const path = require('path');
const { getCurrentTime } = require('./currentTime');

const clearOldFolders = () => {
    const foldersToDelete = [
        path.join(__dirname, './.wwebjs_auth'),
        path.join(__dirname, './qrcode'),
        path.join(__dirname, './.wwebjs_cache')
    ];

    foldersToDelete.forEach((folder) => {
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
            console.log(`[${getCurrentTime()}] Pasta ${folder} deletada.`);
        }
    });
};

module.exports = { clearOldFolders };
