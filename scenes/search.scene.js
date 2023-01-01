const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/product.template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.text = "search_scene_message"

    await template.replyWithHTML()

    return template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    let input = template.ctx.message.text

    template.query.product = await template.ctx.db.Product.find({
      $text: { $search: input },
      checks: "0",
      status: 0,
      user: { $ne: template.ctx.session.user._id },
    })
      .sort({ createdAt: "desc" })
      .select("_id")
      .limit(75)

    template.ctx.session.ids = template.query.product

    if (template.query.product.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.view()
      return
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

secondStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)

    await template.buttons()
    await template.view()
  } catch (e) {
    console.log(e)
  }
})

const scene = new Scenes.WizardScene("search", firstStep, secondStep)

module.exports = scene
