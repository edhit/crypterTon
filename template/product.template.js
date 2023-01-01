require("dotenv").config()
const { Markup } = require("telegraf")

const Template = require("./template")

class Product extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async textTemplate(tags, price) {
    let product = await this.status.product()
    this.text =
      "<b>🔥️ " +
      this.query.product.name +
      "</b>\n📝 " +
      this.query.product.description +
      "\n<pre>🏷️ " +
      price +
      "</pre>" +
      "\n<pre>📦 " +
      this.query.product.delivery.toFixed(this.rounding) +
      " " +
      this.query.product.currency.toUpperCase() +
      "</pre>\n#️⃣ " +
      tags.join(" ") +
      "\n🌌 " +
      this.query.product.media.length +
      " " +
      this.ctx.i18n.t("medias") +
      "\n⚡️ " +
      this.ctx.i18n.t(product[this.query.product.status]) +
      "\n🧮 " +
      this.ctx.i18n.t("sold") +
      " " +
      this.query.order.length +
      " " +
      this.ctx.i18n.t("left") +
      " " +
      (this.query.product.count - this.query.order.length)
  }

  async view() {
    try {
      if (this.obj == undefined) return

      this.keyboard = Markup.inlineKeyboard([[], [], []])

      this.query.product = await this.ctx.db.Product.findOne({
        _id: this.ctx.session.ids[this.obj.id]._id,
      }).populate("user")
      this.query.wishlist = await this.ctx.db.Wishlist.findOne({
        product: this.ctx.session.ids[this.obj.id]._id,
        user: this.ctx.session.user._id,
      })
      this.query.order = await this.ctx.db.Order.find({
        product: this.ctx.session.ids[this.obj.id]._id,
        payment_status: { $ne: 0 },
      })
      this.query.general = await this.ctx.db.General.findOne({
        id: process.env.GENERAL_ID,
      })

      await this.prevAndnext_btn("change-product")
      // console.log(this.query.product._id.toString())
      // console.log(this.query.product.user._id.toString())
      // console.log(this.ctx.session.user._id.toString())
      // console.log(this.query.product.status)
      if (
        this.query.product.status == 0 &&
        this.query.product.user._id.toString() !=
          this.ctx.session.user._id.toString() &&
        this.query.product.count - this.query.order.length > 0
      ) {
        this.keyboard.reply_markup.inline_keyboard[1].push(
          Markup.button.callback(
            "💰 " + this.ctx.i18n.t("reserve"),
            "product_" +
              this.obj.id +
              "_media_" +
              this.obj.media +
              "_action_transaction_" +
              this.ctx.session.callback_query
          )
        )
      }

      if (
        this.query.product.user._id.toString() !=
        this.ctx.session.user._id.toString()
      ) {
        if (this.query.wishlist == null) {
          this.keyboard.reply_markup.inline_keyboard[1].push(
            Markup.button.callback(
              "❤️ " + this.ctx.i18n.t("addtowishlist"),
              "product_" +
                this.obj.id +
                "_media_" +
                this.obj.media +
                "_action_wishlist_" +
                this.ctx.session.callback_query
            )
          )
        } else {
          this.keyboard.reply_markup.inline_keyboard[1].push(
            Markup.button.callback(
              "💔 " + this.ctx.i18n.t("deletefromwishlist"),
              "product_" +
                this.obj.id +
                "_media_" +
                this.obj.media +
                "_action_wishlist_" +
                this.ctx.session.callback_query
            )
          )
        }
      }

      if (
        this.query.product.status == 0 &&
        this.query.product.user._id.toString() !=
          this.ctx.session.user._id.toString()
      ) {
        this.keyboard.reply_markup.inline_keyboard[1].push(
          Markup.button.url(
            this.ctx.i18n.t("sendMessage"),
            "https://t.me/" + this.query.product.user.username
          )
        )
      }

      if (
        this.query.product.status == 0 &&
        this.query.product.user._id.toString() ==
          this.ctx.session.user._id.toString()
      ) {
        this.keyboard.reply_markup.inline_keyboard[1].push(
          Markup.button.callback(
            this.ctx.i18n.t("edit"),
            "product_" +
              this.obj.id +
              "_media_" +
              this.obj.media +
              "_action_edit_" +
              this.ctx.session.callback_query
          )
        )
      }

      let tags = []
      this.query.product.tags
        .split(" ")
        .filter((item, index) =>
          tags.push("#" + this.query.product.tags.split(" ")[index])
        )

      if (this.query.product.media.length > 1) {
        let icon
        let callback
        for (let i = 0; i < this.query.product.media.length; i++) {
          if (i == this.obj.media) {
            icon = "🟢"
            callback = "same"
          } else {
            icon = "🌌"
            callback = this.ctx.session.callback_query
          }
          this.keyboard.reply_markup.inline_keyboard[0].push(
            Markup.button.callback(
              icon,
              "product_" +
                this.obj.id +
                "_media_" +
                i +
                "_action_media_" +
                callback
            )
          )
        }
      }

      let convert = {
        price: this.query.product.price,
        currency: this.query.product.currency.toUpperCase(),
        btc: (
          this.query.product.price /
          this.query.general.coins.bitcoin[this.query.product.currency]
        ).toFixed(this.rounding),
        ton: (
          this.query.product.price /
          this.query.general.coins["the-open-network"][
            this.query.product.currency
          ]
        ).toFixed(this.rounding),
      }
      if (this.query.product.currency == this.ctx.session.user.currency) {
        convert.price =
          this.query.product.price.toFixed(this.rounding) +
          " " +
          convert.currency +
          " \n   " +
          convert.btc +
          " BTC \n   " +
          convert.ton +
          " TON"
      } else {
        if (this.query.product.currency != "usd") {
          convert.price =
            this.query.product.price *
            this.query.general.coins.usd[this.ctx.session.user.currency]
          convert.price = (
            convert.price /
            this.query.general.coins.usd[this.query.product.currency]
          ).toFixed(this.rounding)
        } else {
          convert.price = (
            this.query.product.price *
            this.query.general.coins.usd[this.ctx.session.user.currency]
          ).toFixed(this.rounding)
        }
        convert.currency = this.ctx.session.user.currency.toUpperCase()
        convert.price =
          convert.price +
          " " +
          convert.currency +
          " \n   " +
          convert.btc +
          " BTC \n   " +
          convert.ton +
          " TON"
      }
      // console.log(this.query.product.price + " " + this.query.product.currency)
      await this.textTemplate(tags, convert.price)

      if (this.obj.first == false) {
        await this.ctx.editMessageMedia(
          {
            type: this.query.product.media[this.obj.media].type,
            media: this.query.product.media[this.obj.media].fileId,
            caption: this.text,
            parse_mode: "HTML",
          },
          {
            reply_markup: this.keyboard.reply_markup,
          }
        )
      } else {
        let extra = {
          caption: this.text,
          parse_mode: "HTML",
          reply_markup: this.keyboard.reply_markup,
        }
        if (this.query.product.media[this.obj.media].type == "photo")
          await this.ctx.sendPhoto(
            this.query.product.media[this.obj.media].fileId,
            extra
          )

        if (this.query.product.media[this.obj.media].type == "video")
          await this.ctx.sendVideo(
            this.query.product.media[this.obj.media].fileId,
            extra
          )
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Product
