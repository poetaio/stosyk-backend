const {userService} = require("../../services");
const {UserTypeEnum} = require("../../utils");

class UserController {
    async checkTeacherAuth() {
        return true;
    }

    async checkStudentAuth() {
        return true;
    }

    async isRegistered({user: {userId}}){
        const user = await userService.findOneByUserId(userId);
        return user.type === UserTypeEnum.REGISTERED
    }
}




module.exports = new UserController();
