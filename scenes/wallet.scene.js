const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../helpers/template")
const Payments = require("./../helpers/payments")
const Protect = require("./../helpers/protect")

const template = new Template()
const payments = new Payments()
const protect = new Protect()

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    await protect.new(ctx)

    let text = "wallet_scene_message"

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

    let query_user = await ctx.db.User.findOne({
      _id: ctx.session.user._id,
    })

    if ((await payments.getBalance(input)) == undefined) {
      text = "wallet_scene_incorrect_error_checks"
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return
    }

    query_user.wallet = input
    await query_user.save()

    await ctx.replyWithHTML(ctx.i18n.t(text))

    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("wallet", firstStep, secondStep)

scene.command(["/cancel"], async ctx => {
  try {
    await template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
