const { Composer, Markup } = require("telegraf")
const composer = new Composer()

composer.action(/settings_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    let text = "settings__message"
    let keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.i18n.t("wallet"),
          "wallet_" + ctx.session.callback_query
        ),
        Markup.button.callback(
          ctx.i18n.t("language"),
          "language_" + ctx.session.callback_query
        ),
        Markup.button.callback(
          ctx.i18n.t("currency"),
          "currency_" + ctx.session.callback_query
        ),
      ],
    ])

    await ctx.editMessageText(ctx.i18n.t(text), {
      parse_mode: "HTML",
      reply_markup: keyboard.reply_markup,
    })
  } catch (e) {
    console.log(e)
  }
})

composer.action(/wallet_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    await ctx.scene.enter("wallet")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/language_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    await ctx.scene.enter("language")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/currency_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    await ctx.scene.enter("currency")
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
