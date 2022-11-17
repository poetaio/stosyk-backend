const fetch = require("node-fetch");
const {logger, PaymentStatusEnum} = require("../utils");
const {Subpackage, Teacher} = require('../db/models');
const {encryptData} = require("../utils/dataEncryption");
const {schoolService} = require("./school");
const ValidationError = require("../utils/errors/ValidationError");

class PaymentService {

    async checkUserPackage(packageId, lastPaymentDate){
        const pack = await this.findPackageById(packageId)
        const dateNow = [new Date().getDay(), new Date().getMonth(), new Date().getFullYear()]
        let status = PaymentStatusEnum.PENDING
        if(!lastPaymentDate.includes('Invalid')) {
            status = PaymentStatusEnum.ACTIVE
            const lastPaymentD = new Date(lastPaymentDate)
            let months = (dateNow[2] - lastPaymentD.getFullYear()) * 12
            months -= lastPaymentD.getMonth()
            months += dateNow[1]
            if (months > pack.months) {
                status = PaymentStatusEnum.EXPIRED
            }
            if (months == pack.months) {
                if (dateNow[0] > lastPaymentD.getDay()) {
                    status = PaymentStatusEnum.EXPIRED
                }
            }
        }else{
            lastPaymentDate = null
        }

        return {packageId: packageId, seats: pack.seats, months: pack.months, status: status,  startDate: lastPaymentDate}
    }

    async getUserCards(walletId, defaultCardToken){
        const cardTokens = await this.getCardTokensFromWallet(walletId)
        let cardMasks
        cardTokens.map(async (el) => {
            let add = await this.getCardMaskByToken(el)
            cardMasks.push(add)
        })
        const defaultCardMask  = await this.getCardMaskByToken(defaultCardToken)
        return {cardMasks, defaultCardMask}
    }

    async packageAddSeats(newSeats, teacherId){
        const teacher = await Teacher.findOne({
            where: {teacherId}
        })
        const pack = await this.findPackageById(teacher.packageId)
        const schoolId = await schoolService.getOneByTeacherId(teacherId)
        if(newSeats < pack.seats){
            const seatsTaken = await schoolService.countStudents(schoolId)
            if(seatsTaken > newSeats){
                throw new ValidationError(`School already has more students than package seats`);
            }
        }
        const seats = newSeats - pack.seats
        const res = await schoolService.addStudentsSeats(schoolId, seats)
        return !!res[0]
    }

    async findPackagePriceAndDate(teacher, packageId){
        const newPackage = await this.findPackageById(packageId)
        let price = newPackage.priceUAH
        let date = new Date()
        if(teacher.packageId){
            const check = await this.checkUserPackage(teacher.packageId, teacher.lastPaymentDate)
            if(check.status === PaymentStatusEnum.ACTIVE){
                const currentPackage = await this.findPackageById(teacher.packageId)
                if(currentPackage.priceUAH < newPackage.priceUAH){
                    price = newPackage.priceUAH - currentPackage.priceUAH
                    date = teacher.lastPaymentDate
                }
            }
        }
        return {price: price, date: date}
    }


    async getCardTokensFromWallet(walletId){
        const variables = {
            walletId: walletId
        }
        const result = await fetch('https://api.monobank.ua/api/merchant/wallet', {
            method: 'get',
            headers: {
                'X-Token': process.env.MONOBANK_TOKEN,
            },
            body: JSON.stringify(variables)
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

    async getCardMaskByToken(cardToken){
        const variables = {
            extRef: cardToken
        }
        const res = await fetch('https://api.monobank.ua/api/merchant/wallet/card', {
            method: 'get',
            headers: {
                'X-Token': process.env.MONOBANK_TOKEN,
            },
            body: JSON.stringify(variables)
        })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch((e) => {
                logger.info(e)
            })
        return res.maskedPan
    }

    async addSubPackage(seats, months, priceUAH, priceUSD){
        const pack = await this.findPackageBySeatsAndMonths(seats, months)
        if(pack){
            const upd = await Subpackage.update({
                priceUAH,
                priceUSD
            },{
                where: {
                    packageId: pack.packageId
                }
            })
            return !!upd[0]
        }
        const subpackage = await Subpackage.create({
            seats, months, priceUAH, priceUSD
        })
        return !!subpackage
    }

    async findPackageById(packageId){
        return await Subpackage.findOne({
            where: {packageId}
        })
    }

    async findPackageBySeatsAndMonths(seats, months){
        return await Subpackage.findOne({
            where: {seats, months}
        })
    }

    async createInvoice (packageId, packagePrice, userId)
    {
        const variables = {
            amount: packagePrice*100,
            redirectUrl: `${process.env.FRONTEND_URL}/teacher/myspace/students/pricingpackages/paymentredirect`,
            webHookUrl: `${process.env.HOST}/pay-invoice/?userId=${userId}&packageId=${packageId}`
        }
        const result = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
            method: 'post',
            headers: {
                'X-Token': process.env.MONOBANK_TOKEN,
            },
            body: JSON.stringify(variables)
        })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch((e) => {
                logger.info(e)
            })

        //for testing

        // await Teacher.update({
        //
        //         packageId: packageId,
        //         lastPaymentDate: new Date()
        // },
        //     {
        //         where: {teacherId}
        //     })
        return result
    }

    async payByCard(packageId, packagePrice, paymentDate, teacherId, cardMask, walletId){
        const cardTokens = await this.getCardTokensFromWallet(walletId)
        let paymentCardToken
        cardTokens.map(async (el) => {
            if(cardMask === await this.getCardMaskByToken(el)){
                paymentCardToken = el
            }
        })
        if(!paymentCardToken){
            return false
        }
        const variables = {
            cardToken: paymentCardToken,
            amount: packagePrice*100
        }
        const result = await fetch('https://api.monobank.ua/api/merchant/wallet/payment', {
            method: 'post',
            headers: {
                'X-Token': process.env.MONOBANK_TOKEN,
            },
            body: JSON.stringify(variables)
        })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch((e) => {
                logger.info(e)
            })
        if (result.status === 'success') {
            const defaultCardToken = encryptData(paymentCardToken)
            await Teacher.update({
                packageId,
                lastPaymentDate: paymentDate,
                defaultCardToken
            }, {
                where: {
                    teacherId
                }
            })
            return true
        }
        return false
    }

    async addUserCard(teacherId, walletId, cardToken){

        const defaultCardToken = encryptData(cardToken)
        const res = await Teacher.update({
            walletId,
            defaultCardToken
        },{
            where:
                {
                    teacherId
                }
        })
        return !!res[0]
    }

    async quickPayment(teacher, teacherId, packageId){
        const packInfo = await this.findPackagePriceAndDate(teacher, packageId)
        const res = await Teacher.update({
            packageId,
            lastPaymentDate: packInfo.date
        }, {
            where:{
                teacherId
            }
        })
        return !!res[0]
    }

    async getAllPackages(){
        return await Subpackage.findAll()
    }

    async deleteSubPackage(packageId) {
        await Teacher.update({
            packageId: null
        },{
            where: {
                packageId
            }
        })
        return  !!await Subpackage.destroy({
            where: {
                packageId
            }
        })
    }
}

module.exports = new PaymentService();
