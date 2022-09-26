const {NotFoundError, ValidationError, TaskTypeEnum} = require("../../utils");
const {StudentOption, GapOption, allStudentOptionsBySentenceIdInclude} = require("../../db/models");
const taskService = require("./taskService");
const gapService = require("./gapService");
const optionService = require("./optionService");
const teacherService = require("../user/teacherService");
const pubsubService = require("../pubsubService");
const lessonService = require("./lessonService");
const studentLessonService = require("./studentLessonService");
const homeworkService = require("./homeworkService");

class AnswerService {
    async setMultipleChoiceAnswer(studentId, taskId, { sentenceId, gapId, optionId }) {
        // todo: fix: when setting non-existing gapId, new option-student is always created
        if (!await optionService.existsByIdAndTaskId(optionId, taskId)) {
            throw new ValidationError(`No option ${optionId} exists of task ${taskId}`);
        }

        // creating new student-option if student didn't answer before
        if (!await gapService.existsStudentAnswer(gapId, studentId)) {
            await StudentOption.create({ optionId, studentId });
            return;
        }

        // update existing

        const studentOption = await optionService.getOneByGapIdAndStudentId(gapId, studentId)
        await StudentOption.update({
            optionId
        }, {
            where: { studentId, optionId: studentOption.optionId },
        });
    }

    async setPlainInputAnswer(studentId, taskId, { sentenceId, gapId, input }) {
        const correctOptions = await gapService.getCorrectOptions(gapId);

        const isCorrect = correctOptions.map(option => option.value).includes(input);

        // todo: refactor, get studentOption, if it is null - create new one, otherwise update it
        // to avoid double querying and long joins
        if (!await gapService.existsStudentAnswer(gapId, studentId)) {
            // create new
            let studentOption = await optionService.create(input, isCorrect);
            await GapOption.create({ optionId: studentOption.optionId, gapId });
            await StudentOption.create({ studentId, optionId: studentOption.optionId });
        }

        // update existing
        const option = await optionService.getOneByGapIdAndStudentId(gapId, studentId);
        const [updNum] = await optionService.updateById(option.optionId, input, isCorrect);
        if (!updNum) {
            throw new ValidationError(`Could not update student answer`);
        }
    }

    async setQAAnswer(studentId, taskId, { questionId, optionId }) {
        if (!await optionService.existsByIdSentenceIdAndTaskId(optionId, questionId, taskId)) {
            throw new ValidationError(`No option ${optionId} exists of task ${taskId}`);
        }
        if (await optionService.existsStudentAnswer(studentId, optionId)) {
            throw new ValidationError(`Student ${studentId} has already chosen option ${optionId}`)
        }

        const studentOption = await StudentOption.findOne({
            where: { studentId },
            include: allStudentOptionsBySentenceIdInclude(questionId) ,
        });

        // creating new student-option if student didn't answer before
        if (!studentOption) {
            await StudentOption.create({ optionId, studentId });
            return;
        }

        // update existing
        studentOption.set({
            optionId,
        });

        await studentOption.save();
    }

    async setMatchingAnswer(studentId, taskId, { sentenceId, optionId }) {
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

    async publishOnStudentSetAnswer(pubsub, lessonId) {
        const teacher = await teacherService.findOneByLessonId(lessonId);
        await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacher.teacherId,
            await lessonService.getStudentsAnswers(lessonId));
    }

    async setTaskAnswer(studentId, answer) {
        const { taskId } = answer;
        const task = await taskService.getOneById(taskId);
        // todo: fix for homework
        //       upd: wtf it means?
        // const { taskId, lessonId } = answer;
        // const task = await taskService.getOneByIdAndLessonId(taskId, lessonId);
        if (!task) {
            throw new NotFoundError(`No task ${taskId}`)
        }

        if (task.type === TaskTypeEnum.MULTIPLE_CHOICE && answer.multipleChoice) {
            await this.setMultipleChoiceAnswer(studentId, taskId, answer.multipleChoice);
        } else if (task.type === TaskTypeEnum.PLAIN_INPUT && answer.plainInput) {
            await this.setPlainInputAnswer(studentId, taskId, answer.plainInput);
        } else if (task.type === TaskTypeEnum.MATCHING && answer.matching) {
            await this.setMatchingAnswer(studentId, taskId, answer.matching);
        } else if (task.type === TaskTypeEnum.QA && answer.qa) {
            await this.setQAAnswer(studentId, taskId, answer.qa);
        } else throw new ValidationError(`Invalid input: type object does not match task type with id ${task.taskId}`);
    }

    async setAnswer(pubsub, studentId, answer){
        const { lessonId } = answer;

        if (!await studentLessonService.studentLessonExists(lessonId, studentId)){
            throw new NotFoundError(`No lesson ${lessonId} of student ${studentId} found`);
        }
        if (!await lessonService.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is not active ${lessonId}`);
        }

        await this.setTaskAnswer(studentId, answer);
        await this.publishOnStudentSetAnswer(pubsub, lessonId);

        return true;
    }

    async setHomeworkAnswer(pubsub, studentId, answer) {
        const { homeworkId } = answer;

        if (!await homeworkService.homeworkExists(homeworkId)){
            throw new NotFoundError(`No homework ${homeworkId} found`);
        }

        await this.setTaskAnswer(studentId, answer);

        return true;
    }
}

module.exports = new AnswerService();
