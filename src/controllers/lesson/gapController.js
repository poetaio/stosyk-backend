const { Gap, gapExistsByGapIdAndStudentIdInclude} = require("../../db/entities");
const {gapService, optionService, studentService} = require("../../services");
const {ValidationError, NotFoundError} = require("../../utils");

class GapController {
    async getGaps(parent, args, context) {
        return await gapService.getAll(parent);
    }

    async getStudentAnswer({ gapId }, args, { user : { userId } }) {
        const student = await studentService.findOneByUserId(userId)

        if(!student){
            throw new NotFoundError(`User with id ${userId} and role STUDENT not found`);
        }

        return await gapService.getStudentAnswer(gapId, student.studentId);
    }
}

module.exports = new GapController();
