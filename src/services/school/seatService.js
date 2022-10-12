const {Student, studentBySeatId, studentAccountInclude} = require("../../db/models");
const Sequelize = require("sequelize");

class SeatService {
    async getSeatStudent(seatId) {
        return await Student.findOne({
            include: [
                studentBySeatId(seatId),
                studentAccountInclude,
            ],
            attributes: {
                include: [[Sequelize.col('user.account.login'), 'email']],
            },
        }).then(student => student?.get({plain: true}));
    }
}

module.exports = new SeatService();
