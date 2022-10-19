const fetch = require('node-fetch')
const {logger} = require("../utils");
const {teacherService, paymentService} = require("../services");
const ValidationError = require("../utils/errors/ValidationError");

class PaymentController {

    async createInvoice ({details: {seats, months}}, {user: {userId}}) {
        // ///?????
        // const variables = {
        //     amount: 300
        // }
        // const result = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
        //     method: 'post',
        //     headers: {
        //         'X-Token': process.env.MONOBANK_TOKEN,
        //     },
        //     body: JSON.stringify(variables)
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         return data
        //     })
        //     .catch((e) => {
        //         logger.info(e)
        //     })
        // return result
    }

    async checkUserPackage({user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        return paymentService.checkUserPackage(teacher.packageId, teacher.lastPaymentDate)
    }

    async getUserCards({user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        if(!teacher.walletId){
            throw new ValidationError(`Teacher with id ${teacher.teacherId} has no wallet`);
        }
        return paymentService.getUserCards(teacher.walletId)
    }

    async checkInvoiceStatus({invoiceId}){
        const result = await fetch(`https://api.monobank.ua/api/merchant/invoice/status?invoiceId=${invoiceId}`, {
            method: 'get',
            headers: {
                'X-Token': process.env.MONOBANK_TOKEN,
            }
        })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch((e) => {
                logger.info(e)
            })
        return result
    }

    async addSubPackage(){

    }

}


module.exports = new PaymentController();

