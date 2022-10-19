const fetch = require('node-fetch')
const {logger} = require("../utils");
const {teacherService, paymentService} = require("../services");
const ValidationError = require("../utils/errors/ValidationError");

class PaymentController {

    async createInvoice ({details: {seats, months}}, {user: {userId}}) {
        const pack = await paymentService.findPackageBySeatsAndMonths(seats, months)
        if(!pack){
            throw new ValidationError(`No such package`);
        }
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        paymentService.createInvoice(pack.packageId, pack.priceUAH, teacher.teacherId)
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

    async addSubPackage({package:{seats, months, priceUAH, priceUSD}}){
        return paymentService.addSubPackage(seats, months, priceUAH, priceUSD)
    }

}


module.exports = new PaymentController();

