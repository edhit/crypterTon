const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/settings.template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)

    await template.protect.new(template.ctx)

    await template.view()

    return template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("settings", firstStep)

module.exports = scene