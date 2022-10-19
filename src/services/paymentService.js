const {SubPackagesEnum} = require('../utils/enums')
const fetch = require("node-fetch");
const {logger} = require("../utils");
class PaymentService {
    async checkUserPackage(teacher){
        const pack = SubPackagesEnum.findIndex(x => x == teacher.packageType)
        if(pack){
            SubPackagesEnum.values()
        }
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
