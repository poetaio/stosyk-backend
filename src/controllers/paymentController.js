const fetch = require('node-fetch')
const {logger} = require("../utils");
const {teacherService, paymentService} = require("../services");
const ValidationError = require("../utils/errors/ValidationError");
const {decryptData} = require("../utils/dataEncryption");

class PaymentController {

    async createInvoice ({packageId}, {user: {userId}}) {
        const pack = await paymentService.findPackageById(packageId)
        if(!pack){
            throw new ValidationError(`Package with id ${packageId} not found`);
        }
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        const packInfo = await paymentService.findPackagePriceAndDate(teacher, packageId)
        return await paymentService.createInvoice(pack.packageId, packInfo.price, userId)
    }

    async checkUserPackage({user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        if(!teacher.packageId){
            return null
        }
        return await paymentService.checkUserPackage(teacher.packageId, teacher.lastPaymentDate)
    }

    async getUserCards({user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        if(!teacher.walletId){
            throw new ValidationError(`Teacher with id ${teacher.teacherId} has no wallet`);
        }
        const defaultCardToken = decryptData(teacher.defaultCardToken)
        return await paymentService.getUserCards(teacher.walletId, defaultCardToken)
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
        return await paymentService.addSubPackage(seats, months, priceUAH, priceUSD)
    }

    async addUserCard(req, res){
        const {userId} = req.params;
        const {walletId, cardToken, status} = req.body;
        if(status !== "created"){
            return res.status(404).send(`Card was not created`);
        }
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            return res.status(404).send(`User with id ${userId} and role TEACHER not found`);
        }
        return res.status(200).send(await paymentService.addUserCard(teacher.teacherId, walletId, cardToken))
    }

    async payByCard({packageId, cardMask}, {user: {userId}}){
        const pack = await paymentService.findPackageById(packageId)
        if(!pack){
            throw new ValidationError(`Package with id ${packageId} not found`);
        }
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        if(!teacher.walletId){
            throw new ValidationError(`Teacher with id ${teacher.teacherId} has no wallet`);
        }
        const packInfo = await paymentService.findPackagePriceAndDate(teacher, packageId)
        return await paymentService.payByCard(pack.packageId, packInfo.price, packInfo.date, teacher.teacherId, cardMask, teacher.walletId)
    }

    async userWalletId({user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }
        if(!teacher.walletId){
            throw new ValidationError(`Teacher with id ${teacher.teacherId} has no wallet`);
        }
        return teacher.walletId
    }

    async quickPayment(req, res){
        const userId = req.query.userId
        const packageId = req.query.packageId
        const status = req.body.status
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            return res.status(404).send(`User with id ${userId} and role TEACHER not found`);
        }
        if(status !== 'success'){
            return res.status(404).send(`Payment did not succeed`);
        }
        return res.status(200).send(await paymentService.quickPayment(teacher, teacher.teacherId,  packageId))
    }

    async packagesList(){
        return await paymentService.getAllPackages()
    }

    async deleteSubPackage({packageId}){
        const pack = await paymentService.findPackageById(packageId)
        if(!pack){
            throw new ValidationError(`Package with id ${packageId} not found`);
        }
        return await paymentService.deleteSubPackage(packageId)
    }

}


module.exports = new PaymentController();

