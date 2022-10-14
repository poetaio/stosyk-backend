const express = require('express');
const cors = require('cors');
const multer  = require("multer");

const {logger} = require("../utils");

const storageController = require('../controllers/storageController')

const PORT = process.env.PORT || 5000;

require('../graphql')
require('../middleware');

// шобы не сохранять локально файлы, все в памяти обрабатывается
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (pubsub) => {
    const app = express();
    app.use(cors());
    // npm i express-json
    // app.use(json());

    // отдельный РЕСТ(!) эндпоинт, который принимает файл, сохраняет его
    // (сейчас с помощью реализации на AWS S3) и выдает public link,
    // который потом сохраняется в attachments для таски
    app.post('/storage',  upload.single('file'), (req, res, next) =>
        storageController.uploadFileAndGetLink(req, res));

    // frontend:
    /**
     * webhook: api-stosyk.app/add-card/04acsdf-asdfa-cs-asdfa-ss
     */
    app.post('/add-card/:userId', (req, res) => {
        // get card info from json
        // {
        //     "walletId": "c1376a611e17b059aeaf96b73258da9c",
        //     "cardToken": "E8fm6tQuEELPTi",
        //     "tdsUrl": "https://example.com/tds",
        //     "status": "created"
        // }
        const {userId} = req.params;
        const {walletId, cardToken, tdsUrl, status} = req.body;

        // put in db
    })

    return [app, app.listen(PORT, () => logger.info(`Server is listening on port ${PORT}`))];
};
