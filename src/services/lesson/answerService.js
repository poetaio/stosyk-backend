const {NotFoundError, ValidationError, TaskTypeEnum} = require("../../utils");
const taskService = require("./taskService");
const optionService = require("./optionService");
const gapService = require("./gapService");
const {StudentOption, Option, GapOption} = require("../../models");
const teacherService = require("../user/teacherService");
const pubsubService = require("../pubsubService");
const lessonService = require("./lessonService");

class AnswerService {
    async setMultipleChoiceAnswer(studentId, lessonId, taskId, { sentenceId, gapId, optionId }) {
        // Exception: table name "optionGapOption->gapOptionGap->gapSent…ceGap->sentenceGapSente" specified more than once
        // (too long alias name when joining table)
        // if (!await optionService.existsByIdAndTaskId(optionId, taskId)) {
        //     throw new ValidationError(`No option ${optionId} exists of task ${taskId}`);
        // }
        if (await optionService.existsStudentAnswer(studentId, optionId)) {
            throw new ValidationError(`Student ${studentId} has already chosen option ${optionId}`)
        }

        // creating new student-option if student didn't answer before
        if (!await gapService.existsStudentAnswer(gapId, studentId)) {
            await StudentOption.create({
                optionId,
                studentId
            });
            return;
        }

        // update existing
        await StudentOption.update({
            optionId
        }, {
            where: { studentId },
            include: {
                model: Option,
                include: {
                    association: "optionGapOption",
                    where: { gapId },
                    required: true
                },
                required: true
            }
        });
    }

    async setPlainInputAnswer(studentId, lessonId, taskId, { sentenceId, gapId, input }) {
        const correctOptions = await gapService.getCorrectOptions(gapId);

        const isCorrect = correctOptions.map(option => option.value).includes(input);

        if (!await gapService.existsStudentAnswer(gapId, studentId)) {
            // create new
            let studentOption = await optionService.create(input, isCorrect);
            await GapOption.create({ optionId: studentOption.optionId, gapId });
            await StudentOption.create({ studentId, optionId: studentOption.optionId });
        } else {
            // update existing
            const option = await optionService.getOneByGapIdAndStudentId(gapId, studentId);
            const [updNum] = await optionService.updateById(option.optionId, input, isCorrect);
            if (!updNum) {
                throw new ValidationError(`Could not update student answer`);
            }
        }
    }

    async setQAAnswer(pubsub, studentId) {
        // todo
    }

    async setMatchingAnswer(studentId, lessonId, taskId, { sentenceId, optionId }) {
        // todo: add check if sentence belongs to task
        // todo: check if option exists, sentence exists etc
        const answeredOnSentence = await optionService.existsStudentAnswerBySentenceId(studentId, sentenceId);
        const answeredWithOption = await optionService.existsStudentAnswer(studentId, optionId);

        // if student has such answer
        if (await optionService.existsStudentAnswerBySentenceIdAndOptionId(studentId, sentenceId, optionId)) {
            throw new ValidationError(`Student ${studentId} has already connected sentence ${sentenceId} and option ${optionId}`);
        }

        // if both sentence and option are connected to different
        // delete answer with sentenceId
        // and update sentenceId in answer with optionId
        if (answeredOnSentence && answeredWithOption) {
            await StudentOption.destroy(
                { where: { studentId, sentenceId }}
            );
            await StudentOption.update(
                { sentenceId },
                { where: { studentId, optionId }}
            );
            return;
        }

        // if student put this option to another sentence,
        // update that answer sentenceId
        if (answeredWithOption) {
            await StudentOption.update(
                { sentenceId },
                { where: { studentId, optionId }}
            );
            return;
        }
        // and vice versa if student put another option to this sentence,
        // update that answer optionId
        if (answeredOnSentence) {
            await StudentOption.update(
                { optionId },
                { where: { studentId, sentenceId }}
            );
            return;
        }

        await StudentOption.create({
            studentId,
            optionId,
            sentenceId
        });
    }

    async setAnswer(pubsub, studentId, answer){
        const { taskId, lessonId } = answer;

        if(!await lessonService.studentLessonExists(lessonId, studentId)){
            throw new NotFoundError(`No lesson ${lessonId} of student ${studentId} found`);
        }
        if (!await lessonService.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is not active ${lessonId}`);
        }
        const task = await taskService.getOneByIdAndLessonId(taskId, lessonId);
        if (!task) {
            throw new NotFoundError(`No task ${taskId} of lesson ${lessonId} found`)
        }

        if (task.type === TaskTypeEnum.MULTIPLE_CHOICE && answer.multipleChoice) {
            await this.setMultipleChoiceAnswer(studentId, lessonId, taskId, answer.multipleChoice);
        } else if (task.type === TaskTypeEnum.PLAIN_INPUT && answer.plainInput) {
            await this.setPlainInputAnswer(studentId, lessonId, taskId, answer.plainInput);
        } else if (task.type === TaskTypeEnum.MATCHING && answer.matching) {
            await this.setMatchingAnswer(studentId, lessonId, taskId, answer.matching);
        } else if (task.type === TaskTypeEnum.QA && answer.qa) {
            await this.setQAAnswer(studentId, lessonId, taskId, answer.qa);
        } else throw new ValidationError(`Invalid input`);

        const teacher = await teacherService.findOneByLessonId(lessonId);
        await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacher.teacherId,
            await lessonService.getStudentsAnswers(lessonId));

        return true;
    }
}

module.exports = new AnswerService();
