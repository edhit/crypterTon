const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/product.template")
const Scene = require("./scene")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(ctx)
    await ctx.deleteMessage()

    let sorting = await template.sort.product()

    template.query.product = await template.ctx.db.Product.find({
      user: template.ctx.session.user._id,
    })
      .select("_id")
      .sort(sorting)

    template.ctx.session.ids = template.query.product

    if (template.query.product.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.view()
      return await template.ctx.wizard.next()
    }
    template.text = "search_scene_nothingfound_error_checks"

    await template.replyWithHTML()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const secondStep = new Composer()
secondStep.action(/product_(.+)/, async ctx => {
  try {
    const scene = new Scene()
    await scene.buttons(ctx)
  } catch (e) {
    console.log(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const scene = new Scenes.WizardScene("myproducts", firstStep, secondStep)

module.exports = scene
