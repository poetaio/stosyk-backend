const fetch = require("node-fetch");
const {logger} = require("../utils");
const {Subpackage} = require('../db/models');

class PaymentService {

    async checkUserPackage(packageId, lastPaymentDate){
        const subpackage = Subpackage.findOne({
            where: {packageId}
        })
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
}

module.exports = new PaymentService();
