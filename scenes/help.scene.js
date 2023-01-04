const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/help.template")

const firstStep = new Composer()
firstStep.command("/help", async ctx => {
  try {
    const template = new Template(ctx)

    await template.view()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const scene = new Scenes.WizardScene("help", firstStep)

module.exports = scene
