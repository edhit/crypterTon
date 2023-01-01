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
      this.keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            this.ctx.i18n.t("wallet"),
            "wallet_" + this.ctx.session.callback_query
          ),
          Markup.button.callback(
            this.ctx.i18n.t("language"),
            "language_" + this.ctx.session.callback_query
          ),
          Markup.button.callback(
            this.ctx.i18n.t("currency"),
            "currency_" + this.ctx.session.callback_query
          ),
        ],
      ])

      await this.replyWithHTML()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Settings
