const fetch = require("node-fetch");
const {logger} = require("../utils");
const {Subpackage, Teacher} = require('../db/models');

class PaymentService {

    async checkUserPackage(packageId, lastPaymentDate){
        const subpackage = this.findPackageById()
        const dateNow = [new Date().getDay(), new Date().getMonth(), new Date().getFullYear()]
        let months = (dateNow[2] - lastPaymentDate.getFullYear())*12
        months -=  lastPaymentDate.getMonth()
        months += dateNow[1]
        if(months > subpackage.months){
            return false
        }
        if(months == subpackage.months){
            if(dateNow[0]>lastPaymentDate.getDay()){
                return false
            }
        }
        return true
    }

    async getUserCards(walletId){
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

    async addSubPackage(seats, months, priceUAH, priceUSD){
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

        Teacher.update({
            packageId: packageId
        },
            {
                where: {teacherId}
            })
        return result
    }
}

module.exports = new PaymentService();
