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
      this.keyboard = Markup.inlineKeyboard([[], [], [], []])

      await this.createButton(
        0,
        "callback",
        "addproduct",
        "addproduct_" + this.ctx.session.callback_query
      )
      await this.createButton(
        1,
        "callback",
        "myproducts",
        "myproducts_" + this.ctx.session.callback_query
      )
      await this.createButton(
        1,
        "callback",
        "search",
        "search_" + this.ctx.session.callback_query
      )
      await this.createButton(
        2,
        "callback",
        "wishlist",
        "wishlist_" + this.ctx.session.callback_query
      )
      await this.createButton(
        2,
        "callback",
        "orders",
        "orders_" + this.ctx.session.callback_query
      )
      await this.createButton(
        3,
        "callback",
        "settings",
        "settings_" + this.ctx.session.callback_query
      )

      await this.replyWithHTML()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Start
