const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.action(/language_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "language_select_scene_message"

    let language = await template.status.language()

    await template.generateButton(3, language, "language")

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
secondStep.action(/language_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    template.text = "language_scene_success_checks"

    template.query.user = await template.ctx.db.User.findOne({
      _id: template.ctx.session.user._id,
    })

    template.query.user.language = callback.update[1]
    await template.query.user.save()

    await template.editMessageText()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("language", firstStep, secondStep)

module.exports = scene
