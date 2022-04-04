require('dotenv').config();
const express = require('express');

require('./models/models');
const sequelize = require('./services/dbService');

const PORT = process.env.PORT || 5000;

const app = express();

const run = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
}

run();
