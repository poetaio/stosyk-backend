class UserController {
    async checkTeacherAuth() {
        return true;
    }

    async checkStudentAuth() {
        return true;
    }
}


module.exports = new UserController();
