const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.text = "wallet_scene_message"

    await template.editMessageText()

    return template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)
    template.text = "wallet_scene_success_checks"

    let input = template.ctx.message.text

    template.query.user = await template.ctx.db.User.findOne({
      _id: template.ctx.session.user._id,
    })

    if ((await template.payments.getBalance(input)) == undefined) {
      template.text = "wallet_scene_incorrect_error_checks"
      await template.replyWithHTML()
      return
    }

    template.query.user = input
    await template.query.user.save()

    await template.replyWithHTML()

    return template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("wallet", firstStep, secondStep)

module.exports = scene
