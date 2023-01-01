const { Markup } = require("telegraf")

const Template = require("./template")

class Start extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async view() {
    try {
      // console.log(this.ctx.session)
      // await this.protect.reset(this.ctx)
      // await this.protect.new(this.ctx)

      this.text = "start__message"
      this.keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            this.ctx.i18n.t("addproduct"),
            "addproduct_" + this.ctx.session.callback_query
          ),
          Markup.button.callback(
            this.ctx.i18n.t("myproducts"),
            "myproducts_" + this.ctx.session.callback_query
          ),
        ],
        [
          Markup.button.callback(
            this.ctx.i18n.t("search"),
            "search_" + this.ctx.session.callback_query
          ),
          Markup.button.callback(
            this.ctx.i18n.t("wishlist"),
            "wishlist_" + this.ctx.session.callback_query
          ),
        ],
        [
          Markup.button.callback(
            this.ctx.i18n.t("orders"),
            "orders_" + this.ctx.session.callback_query
          ),
        ],
        [
          Markup.button.callback(
            this.ctx.i18n.t("settings"),
            "settings_" + this.ctx.session.callback_query
          ),
        ],
      ])

      await this.replyWithHTML()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Start
