const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Template = require("./../helpers/template")
const Protect = require("./../helpers/protect")

const template = new Template()
const protect = new Protect()

composer.action(/settings_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await template.settings(ctx)
  } catch (e) {
    console.log(e)
  }
})

composer.action(/wallet_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("wallet")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/language_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("language")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/currency_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return

    await ctx.scene.enter("currency")
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
