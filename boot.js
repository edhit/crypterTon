require("dotenv").config()
const axios = require("axios")
const moment = require("moment")

const Status = require("./helpers/status")

const status = new Status()

const coingecko = async ctx => {
  try {
    let coins = await status.coins()
    let currency = await status.currency()

    let query_general = await ctx.db.General.findOne({
      id: process.env.GENERAL_ID,
    })

    let options = {
      method: "GET",
      url:
        process.env.COINGECKO +
        "ids=" +
        coins.join(",") +
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
    if (query_general == null) {
      let request = await axios.request(options)

      let general = new ctx.db.General()
      general.id = process.env.GENERAL_ID
      general.coins = request.data
      general.fee = 35
      general.currency = "rub"
      general.date = moment().valueOf()
      general.save()
      console.log(request.data)
    } else {
      if (
        moment(query_general.updatedAt).add("1", "m").valueOf() <
        moment().valueOf()
      ) {
        let request = await axios.request(options)
        query_general.coins = request.data
        query_general.date = moment().valueOf()
        query_general.save()
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
    let query_user = await ctx.db.User.findOne({
      user: ctx.chat.id,
    })
    if (query_user == null) {
      user = new ctx.db.User()
      user.user = ctx.chat.id
      user.username = ctx.chat.username
      user.language = "eng"
      user.currency = "usd"
      user.refferal = 0
      user.ban = 0
      user.role = "user"
      query_user = user = await user.save()
    } else {
      if (query_user.username != ctx.chat.username) {
        query_user.username = ctx.chat.username
        query_user = await user.save()
      }
    }
    ctx.session.user = query_user
    ctx.i18n.locale(query_user.language)

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
