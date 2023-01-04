const { Markup } = require("telegraf")

const Template = require("./template")

class Settings extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async view() {
    try {
      this.text = "settings__message"
      this.keyboard = Markup.inlineKeyboard([[], [], []])

      await this.createButton(
        0,
        "callback",
        "wallet",
        "wallet_" + this.ctx.session.callback_query
      )
      await this.createButton(
        0,
        "callback",
        "language",
        "language_" + this.ctx.session.callback_query
      )
      await this.createButton(
        0,
        "callback",
        "currency",
        "currency_" + this.ctx.session.callback_query
      )

      await this.replyWithHTML()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Settings
