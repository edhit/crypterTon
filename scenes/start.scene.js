const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/start.template")

const firstStep = new Composer()
firstStep.command("/start", async ctx => {
  try {
    const template = new Template(ctx)

    await template.protect.new(template.ctx)

    await template.view()

    return template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("start", firstStep)

module.exports = scene
