const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const app = express();

function removeFile(type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}`);
    if (fs.existsSync(pathImg)) {
        fsExtra.emptyDirSync(pathImg);
    }
}

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

app.use(fileUpload());

app.post('/upload/:type', (req, res) => {
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No file selected'
                }
            });
    }

    let type = req.params.type;
    let validTypes = ['type1', 'type2'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Invalid type. Supported types: type1, type2'
            });
    }

    let uploadType = getFolderType(type);
    let file = req.files.selectedFile;
    let fileNameSplit = file.name.split('.');
    let extension = fileNameSplit[fileNameSplit.length - 1];

    // Filter by extensions
    let validExtensions = ['png', 'jpg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Invalid extension file. Supported extensions: .png'
            });
    }

    removeFile(uploadType);

    // Change the filename
    let newFilename = `USER-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${uploadType}/${newFilename}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'File uploaded'
        });
    });
});

module.exports = app;
