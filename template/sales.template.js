const { Markup } = require("telegraf")

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
      " TON\n✉️ " +
      this.query.order.uuid +
      "</pre>\n\n⚡️ " +
      this.ctx.i18n.t(order[this.query.order.status])
  }

  async view() {
    try {
      if (this.obj == undefined) return

      this.keyboard = Markup.inlineKeyboard([
        [],
        [],
        [],
        [
          Markup.button.callback(
            this.ctx.i18n.t("back"),
            "orders_" + this.ctx.session.callback_query
          ),
        ],
      ])
      this.query.order = await this.ctx.db.Order.findOne({
        _id: this.ctx.session.ids[this.obj.id]._id,
      })
        .populate("product")
        .populate("user")
        .populate("wallet")

      switch (this.query.order.payment_status) {
        case 1:
          this.keyboard.reply_markup.inline_keyboard[1].push(
            Markup.button.callback(
              this.ctx.i18n.t("cancel_order"),
              "product_" +
                this.obj.id +
                "_media_" +
                this.obj.media +
                "_action_cancelorder_" +
                this.ctx.session.callback_query
            )
          )
          break
      }
      this.keyboard.reply_markup.inline_keyboard[1].push(
        Markup.button.url(
          this.ctx.i18n.t("sendMessage"),
          "https://t.me/" + this.query.order.user.username
        )
      )

      await this.prevAndnext_btn("change-sales")

      await this.textTemplate()

      await this.editMessageText()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Sales
