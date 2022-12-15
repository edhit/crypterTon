const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Protect = require("./../helpers/protect")

const protect = new Protect()

composer.action(/addproduct_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("addproduct")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/myproducts_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("myproducts")
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
