class AccountController {
    async registerTeacher({ email, password }) {
        return true;
    }

    async loginTeacher({ email, password }) {
        return false;
    }
}


module.exports = new AccountController();
