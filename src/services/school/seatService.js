const {Student, studentBySeatId} = require("../../db/models");

class SeatService {
    async getSeatStudent(seatId) {
        return await Student.findOne({
            include: studentBySeatId(seatId),
        });
    }
}

module.exports = new SeatService();
