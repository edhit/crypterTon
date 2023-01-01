const { Markup } = require("telegraf")

const Template = require("./template")

class Help extends Template {
  constructor(ctx = false) {
    super()
    if (ctx != false) {
      this.ctx = ctx
    }
  }

  async view() {
    try {
      this.text = `
      /calc - Калькулятор
      /pass - Генератор пароля
      /stats - Статистика для админов
          `

      await this.replyWithHTML()
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = Help
