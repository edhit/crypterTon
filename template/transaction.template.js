require("dotenv").config()
const { Markup } = require("telegraf")
const moment = require("moment")
const { v4: uuidv4 } = require("uuid")

const Template = require("./template")

class Transaction extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async textTemplate() {
    switch (this.query.order.payment_status) {
      case 0:
        // (pos, type, name, callback)
        await this.createButton(
          0,
          "callback",
          "confirm",
          "product_" +
            this.obj.id +
            "_media_0_action_transaction_" +
            this.ctx.session.callback_query
        )
        await this.createButton(
          0,
          "url",
          "pay",
          "ton://transfer/" +
            this.query.order.wallet.wallet.wallet +
            "?amount=" +
            (await this.payments.toNano(this.query.amount.toString())) +
            "&text=" +
            this.query.order.uuid
        )

        await this.createButton(
          1,
          "callback",
          "cancel",
          "product_" +
            this.obj.id +
            "_media_0_action_canceltransation_" +
            this.ctx.session.callback_query
        )

        this.text =
          "<b>🔥️ " +
          this.query.product.name +
          "</b>\n\n" +
          "<pre>💎 " +
          this.query.order.wallet.wallet.wallet +
          "\n🏷️ " +
          this.query.amount +
          " TON (+" +
          this.query.order.fee.toFixed(this.rounding) +
          " TON)\n✉️ " +
          this.query.order.uuid +
          "</pre>\n\n " +
          this.ctx.i18n.t("instruction_pay") +
          "\n\n<b>🕒 " +
          this.ctx.i18n.t("left") +
          "</b> " +
          moment(
            moment(this.query.order.createdAt).add("15", "m").valueOf() -
              moment().valueOf()
          ).format("mm:ss")

        // "Способы оплаты \n \
        // 1. Отсканируйте код через приложение (Tonkeeper, Tonhub) \n\n\
        // 2. Отправьте точную сумму на кошелек TON с указанием комментария"
        // 3. Без uuid мы не сможем вернуть средства
        break
      case 1:
        let payment = await this.status.payment()
        await this.createButton(
          0,
          "url",
          "transaction",
          process.env.TONAPI + this.query.order.wallet.wallet.wallet
        )
        await this.createButton(
          1,
          "callback",
          "back",
          "product_" +
            this.obj.id +
            "_media_0_action_canceltransation_" +
            this.ctx.session.callback_query
        )

        this.text =
          "<b>🔥️ " +
          this.query.product.name +
          "</b>\n\n ⚡️ " +
          this.ctx.i18n.t(payment[this.query.order.payment_status])
        break
    }
  }

  async view() {
    try {
      if (this.obj == undefined) return

      this.keyboard = Markup.inlineKeyboard([[], [], []])

      this.query.product = await this.ctx.db.Product.findOne({
        _id: this.ctx.session.ids[this.obj.id]._id,
      }).populate("user")
      this.query.general = await this.ctx.db.General.findOne({
        id: process.env.GENERAL_ID,
      })
      this.query.order = await this.ctx.db.Order.findOne({
        product: this.ctx.session.ids[this.obj.id]._id,
        user: this.ctx.session.user._id,
        $or: [{ payment_status: 0 }, { payment_status: 1 }],
      }).populate("wallet")

      if (this.query.order == null) {
        let fee =
          this.query.general.fee /
            this.query.general.coins["the-open-network"][
              this.query.general.currency
            ] +
          parseInt(process.env.FEE)

        let toncoin = await this.payments.createWallet()
        let uuid = uuidv4()
        let address = this.ctx.db.Address()
        address.user = this.ctx.session.user._id
        address.wallet = toncoin
        address.uuid = uuid
        address.save()
        let order = this.ctx.db.Order()
        order.user = this.ctx.session.user._id
        order.product = this.ctx.session.ids[this.obj.id]._id
        order.uuid = uuid
        order.wallet = address._id
        order.amount = (
          (this.query.product.price + this.query.product.delivery) /
            this.query.general.coins["the-open-network"][
              this.query.product.currency
            ] +
          fee
        ).toFixed(this.rounding)
        order.price = (
          this.query.product.price /
          this.query.general.coins["the-open-network"][
            this.query.product.currency
          ]
        ).toFixed(this.rounding)
        order.fee = fee
        order.status = 0
        order.payment_status = 0
        order.save()
        return await this.view()
      }

      if (this.query.order.payment_status == 0) {
        if (
          moment(this.query.order.createdAt).add("15", "m").valueOf() <
          moment().valueOf()
        ) {
          // console.log("15m")
          this.query.order.delete()
          return await this.view()
        } else {
          let balance = await this.payments.getBalance(
            this.query.order.wallet.wallet.wallet
          )
          if (
            Number(await this.payments.fromNano(balance)).toFixed(
              this.rounding
            ) >= Number(this.query.order.amount).toFixed(this.rounding)
          ) {
            this.query.order.status = 1
            this.query.order.payment_status = 1
            this.query.order.save()
            await this.ctx.telegram.sendMessage(
              this.query.product.user.user.toString(),
              this.ctx.i18n.t("new_order")
            )
          } else {
            balance = await this.payments.fromNano(balance)
            this.query.amount = (
              Number(this.query.order.amount) - Number(balance)
            ).toFixed(this.rounding)
          }
        }
      }

      let media
      if (this.query.order.payment_status == 0) {
        media = await this.qrcode.create(
          "ton://transfer/" +
            this.query.order.wallet.wallet.wallet +
            "?amount=" +
            (await this.payments.toNano(this.query.amount.toString())) +
            "&text=" +
            this.query.order.uuid
        )
        await this.textTemplate()
      } else {
        media = await this.qrcode.create(
          process.env.TONAPI + this.query.order.wallet.wallet.wallet
        )
        await this.textTemplate()
      }

      await this.ctx.editMessageMedia(
        {
          type: "photo",
          media: { source: media },
          caption: this.text,
          parse_mode: "HTML",
        },
        {
          reply_markup: this.keyboard.reply_markup,
        }
      )
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Transaction
