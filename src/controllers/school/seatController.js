const {seatService} = require("../../services/school");

class SeatController {
    async getStudent({seatId}) {
        return await seatService.getSeatStudent(seatId);
    }
}

module.exports = new SeatController();
