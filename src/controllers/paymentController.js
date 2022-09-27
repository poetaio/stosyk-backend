const fetch = require('node-fetch')

class PaymentController {

    async createInvoice () {
        const variables = {
            amount: 300
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
                console.log(e)
            })
        return result
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
                console.log(e)
            })
        return result
    }

}


module.exports = new PaymentController();

