const axios = require('axios')
const moment = require('moment')
require('dotenv').config()

const update = async ctx => {
  try {
    let query = await ctx.db.General.findOne({id: process.env.GENERAL_ID})

    let crypto = await ctx.helpers.mark.crypto()
    let currency = await ctx.helpers.mark.currency()
    let options = {
        method: 'GET',
        url: process.env.COINGECKO + 'ids=' + crypto.join(',') + '&vs_currencies=' + currency.join(','),
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json',
        },
        charset: 'utf8',
        responseEncodig: 'utf8'
    };
    if (query == null) {
      let createKeyPair = await ctx.helpers.payments.createKeyPair()
      let toncoin = await ctx.helpers.payments.createWallet(createKeyPair.keyPair)

      let request = await axios.request(options);
      let general = new ctx.db.General()
      general.id = process.env.GENERAL_ID
      general.coins = request.data
      general.toncoin = {
        address: toncoin.address,
        seed: createKeyPair.words
      }
      general.date = moment().valueOf()
      general.save()
      console.log(request.data);
    } else {
      if (moment(query.updatedAt).add('1', 'm').valueOf() < moment().valueOf()) {
        let request = await axios.request(options);
        query.coins = request.data
        query.date = moment().valueOf()
        query.save()
        console.log(request.data);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { update }
