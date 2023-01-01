const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/product.template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.query.product = await template.ctx.db.Product.find({
      user: template.ctx.session.user._id,
    })
      .select("_id")
      .sort({ updatedAt: "desc" })

    template.ctx.session.ids = template.query.product

    if (template.query.product.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.view()
      return template.ctx.wizard.next()
    }
    template.text = "search_scene_nothingfound_error_checks"

    await template.replyWithHTML()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    return template.ctx.scene.leave()
  }
})

const secondStep = new Composer()
secondStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)

    await template.buttons()
    await template.view()
  } catch (e) {
    console.log(e)
  }
})

const scene = new Scenes.WizardScene("myproducts", firstStep, secondStep)

module.exports = scene
