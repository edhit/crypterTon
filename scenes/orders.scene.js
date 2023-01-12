const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/orders.template")

const firstStep = new Composer()
firstStep.action(/orders_(.+)/, async ctx => {
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

firstStep.command("/orders", async ctx => {
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

const scene = new Scenes.WizardScene("orders", firstStep)

module.exports = scene
