const Template = require("./template")

class Sales extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async textTemplate() {
    let order = await this.status.order()
    this.text =
      this.query.order.user.username +
      "<b>🔥️ " +
      this.query.order.product.name +
      "</b>\n\n" +
      "<pre>💎 " +
      this.query.order.wallet.wallet.wallet +
      "\n🏷️ " +
      this.query.order.amount +
      " TON </pre>\n\n ⚡️" +
      this.ctx.i18n.t(order[this.query.order.status])
  }

  async view() {
    try {
      if (this.obj == undefined) return

      this.query.order = await this.ctx.db.Order.findOne({
        _id: this.ctx.session.ids[this.obj.id]._id,
      })
        .populate("product")
        .populate("user")
        .populate("wallet")

      switch (this.query.order.payment_status) {
        case 1:
          await this.createButton(
            1,
            "callback",
            "cancel_order", //
            "product_" +
              this.obj.id +
              "_media_" +
              this.obj.media +
              "_action_cancelorder_" +
              this.ctx.session.callback_query
          )
          break
      }

      await this.createButton(
        2,
        "url",
        "sendMessage", //✉️
        "https://t.me/" + this.query.order.user.username
      )

      await this.createButton(
        1,
        "callback",
        "sort",
        "sort_" + this.ctx.session.callback_query
      )

      await this.prevAndnextButton("change-sales")

      await this.textTemplate()

      await this.editMessageText()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Sales
