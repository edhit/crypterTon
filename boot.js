const axios = require("axios")
const moment = require("moment")
require("dotenv").config()

const coingecko = async ctx => {
  try {
    let query = await ctx.db.General.findOne({ id: process.env.GENERAL_ID })

    let crypto = await ctx.helpers.mark.crypto()
    let currency = await ctx.helpers.mark.currency()
    let options = {
      method: "GET",
      url:
        process.env.COINGECKO +
        "ids=" +
        crypto.join(",") +
        "&vs_currencies=" +
        currency.join(","),
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      },
      charset: "utf8",
      responseEncodig: "utf8",
    }
    if (query == null) {
      let wallet = await ctx.helpers.payments.createWallet()
      // let address = await ctx.helpers.payments.createWallet(keyPair.keyPair)
      let request = await axios.request(options)
      let general = new ctx.db.General()
      general.id = process.env.GENERAL_ID
      general.coins = request.data
      general.toncoin = wallet
      general.fee = 35
      general.currency = "rub"
      general.date = moment().valueOf()
      general.save()
      console.log(request.data)
    } else {
      if (
        moment(query.updatedAt).add("1", "m").valueOf() < moment().valueOf()
      ) {
        let request = await axios.request(options)
        query.coins = request.data
        query.date = moment().valueOf()
        query.save()
        console.log(request.data)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

// ids=the-open-network,bitcoin&vs_currencies=usd,rub
const boot = async (ctx, next) => {
  let session = await ctx.db.connection.startSession()
  await session.startTransaction()
  try {
    if (ctx.chat == undefined) throw "stop bot"
    // let handler = await ctx.helpers.handlerData(ctx);
    let user = await ctx.db.User.findOne({
      user: ctx.chat.id,
    })
    if (user == null) {
      user = new ctx.db.User()
      user.user = ctx.chat.id
      user.username = ctx.chat.username
      user.language = "eng"
      user.currency = "usd"
      user.refferal = 0
      user.ban = 0
      user.role = "user"
      user = await user.save()
    } else {
      if (user.username != ctx.chat.username) {
        user.username = ctx.chat.username
        user = await user.save()
      }
    }

    ctx.i18n.locale(user.language)

    await coingecko(ctx)

    await next()
  } catch (e) {
    console.log(e)
  } finally {
    await session.commitTransaction()
    await session.endSession()
  }
}

module.exports = boot
