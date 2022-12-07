const { Composer, Scenes, Markup } = require("telegraf")
const randomstring = require("randomstring")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    let text = "wallet_scene_message"

    ctx.session.callback_query = randomstring.generate({
      length: 12,
      charset: "alphabetic",
    })

    await ctx.editMessageText(ctx.i18n.t(text), {
      parse_mode: "HTML",
    })

    return ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.on("text", async ctx => {
  try {
    let text = "wallet_scene_success_checks"
    let input = ctx.message.text

    let query = await ctx.db.User.findOne({
      user: ctx.chat.id,
    })

    if ((await ctx.helpers.payments.getBalance(input)) == undefined) {
      text = "wallet_scene_incorrect_error_checks"
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return
    }

    query.wallet = input
    await query.save()

    await ctx.replyWithHTML(ctx.i18n.t(text))

    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("wallet", firstStep, secondStep)

scene.command(["/cancel", "/start"], async ctx => {
  try {
    await ctx.helpers.template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
