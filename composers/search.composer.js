const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Protect = require("./../helpers/protect")

const protect = new Protect()

composer.action(/search_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("search")
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
