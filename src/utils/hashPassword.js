const bcrypt = require('bcrypt');

module.exports = async (password) => await new Promise((resolve, reject) => {
    bcrypt.hash(password, Number.parseInt(process.env.SALT_ROUNDS), (err, hash) => {
        if (err) reject(err);
        resolve(hash);
    })
});
