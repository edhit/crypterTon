const randomstring = require("randomstring")

class Protect {
  async callback(ctx) {
    try {
      let update = ctx.update.callback_query.data.split("_")
      let callback = update.pop()

      if (callback != ctx.session.callback_query) throw "callback_query is old"
      await ctx.answerCbQuery(ctx.i18n.t("wait"), false)
      return {
        update: update,
        callback: callback,
      }
    } catch (e) {
      console.log(e)
      await ctx.answerCbQuery(e, false)
    }
  }

  async new(ctx) {
    try {
      ctx.session.callback_query = randomstring.generate({
        length: 12,
        charset: "alphabetic",
      })
    } catch (e) {
      console.log(e)
    }
  }

  async reset(ctx) {
    try {
      Object.keys(ctx.session).forEach(function (prop) {
        if (prop != "user") delete ctx.session[prop]
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Protect
