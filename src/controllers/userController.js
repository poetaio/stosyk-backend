class UserController {
    async get(req, res) {
        res.status(200).send('User endpoint');
    }
}

module.exports = new UserController();
