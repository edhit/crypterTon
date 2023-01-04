const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "wallet_scene_message"

    await template.editMessageText()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
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

      return await template.replyWithHTML()
    }

    template.query.user = input
    await template.query.user.save()

    await template.replyWithHTML()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const scene = new Scenes.WizardScene("wallet", firstStep, secondStep)

module.exports = scene
