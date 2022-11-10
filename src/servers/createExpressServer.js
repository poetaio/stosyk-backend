const express = require('express');
const cors = require('cors');
const multer  = require("multer");

const {logger} = require("../utils");

const storageController = require('../controllers/storageController')

const PORT = process.env.PORT || 5000;

require('../graphql')
require('../middleware');
const {paymentController} = require("../controllers");

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


    app.post('/add-card/:userId', (req, res, next) =>
        paymentController.addUserCard(req, res));

    app.post('/pay-invoice/:userId/:packageId', (req, res, next) =>
        paymentController.quickPayment(req, res));

    return [app, app.listen(PORT, () => logger.info(`Server is listening on port ${PORT}`))];
};
