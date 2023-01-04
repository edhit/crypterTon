const { Markup } = require("telegraf")

const Protect = require("./../helpers/protect")
const Status = require("./../helpers/status")
const Payments = require("./../helpers/payments")
const Qrcode = require("./../helpers/qrcode")
const Checker = require("./../helpers/checker")
const Sort = require("./../helpers/sort")

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
  sort = new Sort()

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

  async createButton(pos, type, name, callback) {
    this.keyboard.reply_markup.inline_keyboard[pos].push(
      Markup.button[type](this.ctx.i18n.t(name), callback)
    )
  }

  async generateButton(row, arr, callback) {
    let keyboard = []
    let length = Math.ceil(arr.length / row)
    for (let i = 0; i < length; i++) {
      const c = arr.slice(i * row, i * row + row)
      keyboard.push(
        c.map(name =>
          Markup.button.callback(
            name,
            callback + "_" + name + "_" + this.ctx.session.callback_query
          )
        )
      )
    }

    this.keyboard = Markup.inlineKeyboard(keyboard)
  }

  async prevAndnextButton(name) {
    // //⬅️ //➡️
    if (this.ctx.session.ids.length > 1) {
      if (this.obj.id == 0) {
        this.createButton(
          2,
          "callback",
          "next",
          `product_${parseInt(this.obj.id) + 1}_media_0_action_${name}_${
            this.ctx.session.callback_query
          }`
        )
      } else if (
        this.obj.id > 0 &&
        this.obj.id < parseInt(this.ctx.session.ids.length) - 1
      ) {
        this.createButton(
          2,
          "callback",
          "prev",
          `product_${parseInt(this.obj.id) - 1}_media_0_action_${name}_${
            this.ctx.session.callback_query
          }`
        )
        this.createButton(
          2,
          "callback",
          "next",
          `product_${parseInt(this.obj.id) + 1}_media_0_action_${name}_${
            this.ctx.session.callback_query
          }`
        )
      } else {
        this.createButton(
          2,
          "callback",
          "prev",
          `product_${parseInt(this.obj.id) - 1}_media_0_action_${name}_${
            this.ctx.session.callback_query
          }`
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
