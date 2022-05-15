const express = require('express');
const cors = require('cors');
const multer  = require("multer");

const storageController = require('../controllers/storageController')

const PORT = process.env.PORT || 5000;

const schema = require('../schemas')
const { errorHandlingMiddleware, parseRestRequest} = require('../middleware');

// шобы не сохранять локально файлы, все в памяти обрабатывается
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (pubsub) => {
    const app = express();
    app.use(cors());

    // отдельный РЕСТ(!) эндпоинт, который принимает файл, сохраняет его
    // (сейчас с помощью реализации на AWS S3) и выдает public link,
    // который потом сохраняется в attachments для таски
    app.post('/storage',  upload.single('file'), (req, res, next) =>
        storageController.uploadFileAndGetLink(req, res));

    return [app, app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))];
};
