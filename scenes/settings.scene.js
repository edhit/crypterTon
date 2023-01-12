const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/settings.template")

const firstStep = new Composer()
firstStep.action(/settings_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    await ctx.deleteMessage()

    await template.view()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

firstStep.command("settings", async ctx => {
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

const scene = new Scenes.WizardScene("settings", firstStep)

module.exports = scene
