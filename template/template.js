const { Markup } = require("telegraf")

const Protect = require("./../helpers/protect")
const Status = require("./../helpers/status")
const Payments = require("./../helpers/payments")
const Qrcode = require("./../helpers/qrcode")
const Checker = require("./../helpers/checker")

class Template {
  ctx = undefined
  obj = undefined

  text = undefined
  keyboard = undefined
  query = {}

  rounding = 5

  protect = new Protect()
  status = new Status()
  payments = new Payments()
  qrcode = new Qrcode()
  checker = new Checker()

  async replyWithHTML() {
    if (this.keyboard == undefined) {
      await this.ctx.replyWithHTML(this.ctx.i18n.t(this.text))
    } else {
      await this.ctx.replyWithHTML(this.ctx.i18n.t(this.text), {
        reply_markup: this.keyboard.reply_markup,
      })
    }
  }

  async editMessageText() {
    if (this.keyboard == undefined) {
      await this.ctx.editMessageText(this.ctx.i18n.t(this.text))
    } else {
      await this.ctx.editMessageText(this.ctx.i18n.t(this.text), {
        reply_markup: this.keyboard.reply_markup,
        parse_mode: "HTML",
      })
    }
  }

  async canceled() {
    this.text = this.text == undefined ? "stop /start" : this.text
    await this.ctx.replyWithHTML(this.text, {
      reply_markup: { remove_keyboard: true },
      parse_mode: "HTML",
    })
  }

  async buttons() {
    try {
      if (typeof (await this.protect.callback(this.ctx)) != "object") return
      let callback = await this.protect.callback(this.ctx)

      let data = []
      let row = 2
      let length = Math.ceil(callback.update.length / row)
      for (let i = 0; i < length; i++) {
        const c = callback.update.slice(i * row, i * row + row)
        data.push(c)
      }

      let entries = Object.fromEntries(new Map(data))
      console.log(entries)
      console.log(data)

      this.obj = {
        id: entries.product,
        media: entries.media,
        first: false,
      }

      switch (entries.action) {
        case "wishlist":
          this.query.wishlist = await this.ctx.db.Wishlist.findOne({
            product: this.ctx.session.ids[this.obj.id]._id,
            user: this.ctx.session.user._id,
          })
          if (this.query.wishlist == null) {
            let wishlist = new this.ctx.db.Wishlist()
            wishlist.user = this.ctx.session.user._id
            wishlist.product = this.ctx.session.ids[this.obj.id]._id
            await wishlist.save()
          } else {
            await this.query.wishlist.delete()
          }

          // await product.view()
          break
        case "transaction":
          // this.query.product = await this.ctx.db.Product.findOne({
          //   _id: ctx.session.ids[this.obj.id]._id,
          //   status: 0,
          // })

          // if (this.query.product == null)
          //   await this.ctx.answerCbQuery(
          //     ctx.i18n.t("product_maybe_deleted"),
          //     false
          //   )
          break
        case "change-product":
          // product.ctx = ctx
          // product.obj = obj
          // await product.view()
          break
        case "media":
          // product.ctx = ctx
          // product.obj = obj
          // await product.view()
          break
        case "canceltransation":
          // product.ctx = ctx
          // product.obj = obj
          // await product.view()
          break
        case "change-purchase":
          // purchases.ctx = ctx
          // purchases.obj = obj
          // await purchases.view()
          break
        case "change-sales":
          // sales.ctx = ctx
          // sales.obj = obj
          // await sales.view()
          break
      }
    } catch (e) {
      console.log(e)
    }
  }

  async prevAndnext_btn(name) {
    if (this.ctx.session.ids.length > 1) {
      if (this.obj.id == 0) {
        this.keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            "➡️",
            "product_" +
              (parseInt(this.obj.id) + 1) +
              "_media_0_action_" +
              name +
              "_" +
              this.ctx.session.callback_query
          )
        )
      } else if (
        this.obj.id > 0 &&
        this.obj.id < parseInt(this.ctx.session.ids.length) - 1
      ) {
        this.keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            "⬅️",
            "product_" +
              (parseInt(this.obj.id) - 1) +
              "_media_0_action_" +
              name +
              "_" +
              this.ctx.session.callback_query
          )
        )
        this.keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            "➡️",
            "product_" +
              (parseInt(this.obj.id) + 1) +
              "_media_0_action_" +
              name +
              "_" +
              this.ctx.session.callback_query
          )
        )
      } else {
        this.keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            "⬅️",
            "product_" +
              (parseInt(this.obj.id) - 1) +
              "_media_0_action_" +
              name +
              "_" +
              this.ctx.session.callback_query
          )
        )
      }
    }
  }

  constructor(ctx = false) {
    if (ctx != false) {
      this.ctx = ctx
    }
  }
}

module.exports = Template
