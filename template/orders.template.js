const { Markup } = require("telegraf")

const Template = require("./template")

class Order extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async view() {
    try {
      // let query_order = this.ctx.db.Order.find({
      //   user: this.ctx.session.user._id,
      // }).select("_id")

      this.text = "orders__message"
      this.keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            this.ctx.i18n.t("purchases"),
            "purchases_" + this.ctx.session.callback_query
          ),
          Markup.button.callback(
            this.ctx.i18n.t("sales"),
            "sales_" + this.ctx.session.callback_query
          ),
        ],
      ])

      await this.replyWithHTML()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Order
