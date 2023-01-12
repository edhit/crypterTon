require("dotenv").config()
const axios = require("axios")
const moment = require("moment")

const database = require("./database")
const Status = require("./helpers/status")

const status = new Status()
const coingecko = async () => {
  try {
    let coins = await status.coins()
    let currency = await status.currency()

    const database = require("./database")
    let query_general = await database.db.General.findOne({
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

      let general = new database.db.General()
      general.id = process.env.GENERAL_ID
      general.coins = request.data
      general.fee = 35
      general.currency = "rub"
      general.date = moment().valueOf()
      general.save()
      // console.log(request.data)
    } else {
      if (
        moment(query_general.updatedAt).add("1", "m").valueOf() <
        moment().valueOf()
      ) {
        let request = await axios.request(options)
        query_general.coins = request.data
        query_general.date = moment().valueOf()
        query_general.save()
        console.log("1")
      }
    }
    setTimeout(coingecko, 30000)
  } catch (e) {
    console.log(e)
  }
}
coingecko()
