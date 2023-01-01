const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/help.template")

const firstStep = new Composer()
firstStep.command("/help", async ctx => {
  try {
    const template = new Template(ctx)

    await template.protect.new(template.ctx)

    await template.view()

    return template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("help", firstStep)

module.exports = scene
