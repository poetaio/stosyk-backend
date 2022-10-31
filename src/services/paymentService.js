const fetch = require("node-fetch");
const {logger} = require("../utils");
const {Subpackage, Teacher} = require('../db/models');

class PaymentService {

    async checkUserPackage(packageId, lastPaymentDate, seatsInSchool){
        const pack = this.findPackageById()
        const dateNow = [new Date().getDay(), new Date().getMonth(), new Date().getFullYear()]
        let months = (dateNow[2] - lastPaymentDate.getFullYear())*12
        months -=  lastPaymentDate.getMonth()
        months += dateNow[1]
        if(months > pack.months){
            return false
        }
        if(months == pack.months){
            if(dateNow[0]>lastPaymentDate.getDay()){
                return false
            }
        }

        if(pack.seats < seatsInSchool){
            return false
        }

        return true
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

    async createInvoice (packageId, packagePrice, teacherId)
    {
        const variables = {
            amount: packagePrice*100
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

        await Teacher.update({
            packageId: packageId
        },
            {
                where: {teacherId}
            })
        return result
    }

    async payByCard(packageId, packagePrice, teacherId, cardMask, walletId){
        const cardTokens = this.getCardTokensFromWallet(walletId)
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
            await Teacher.update({
                packageId,
                lastPaymentDate: Date.now(),
                defaultCardToken: paymentCardToken
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
        const res = await Teacher.update({
            walletId,
            defaultCard: cardToken
        },{
            where:
                {
                    teacherId
                }
        })
        return !!res[0]
    }

    async quickPayment(teacherId){
        const res = await Teacher.update({
            lastPaymentDate: Date.now()
        }, {
            where:{
                teacherId
            }
        })
        return !!res[0]
    }
}

module.exports = new PaymentService();
