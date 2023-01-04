const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "currency_select_scene_message"
    let currency = await template.status.currency()

    await template.generateButton(3, currency, "currency")

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
secondStep.action(/currency_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    template.text = "currency_scene_success_checks"

    template.query.user = await template.ctx.db.User.findOne({
      _id: template.ctx.session.user._id,
    })

    template.query.user.currency = callback.update[1]
    await template.query.user.save()

    await template.editMessageText()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const scene = new Scenes.WizardScene("currency", firstStep, secondStep)

module.exports = scene
