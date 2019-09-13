const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

function getFolderType(type) {
    let uploadType = '';

    switch(type) {
        case 'type1':
            uploadType = 'folder1';
            break;
        case 'type2':
        default:
            uploadType = 'folder2';
            break;
    }

    return uploadType;
}

app.get('/images/:type/:img', (req, res) => {
    let type = req.params.type;
    let img = req.params.img;
    let folderType = getFolderType(type);
    let pathImg = path.resolve(__dirname, `../../uploads/${folderType}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let notFoundImagePath = path.resolve(__dirname, '../assets/not_found.png');
        res.sendFile(notFoundImagePath);
    }
});

module.exports = app;
