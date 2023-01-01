const { Composer, Scenes, Markup } = require("telegraf")
const mongoose = require("mongoose")

const Template = require("./../template/sales.template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.query.product = await template.ctx.db.Product.find({
      user: template.ctx.session.user._id,
    }).select("_id")

    let ids = []
    template.query.product.filter((item, index) =>
      ids.push(mongoose.Types.ObjectId(template.query.product[index]._id))
    )

    template.query.order = await template.ctx.db.Order.find({
      product: { $in: ids },
      payment_status: { $ne: 0 },
    })
      .select("_id")
      .sort({ createdAt: "desc" })

    template.ctx.session.ids = template.query.order

    if (template.query.order.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.view()
      return template.ctx.wizard.next()
    }
    template.text = "sales_scene_nothingfound_error_checks"

    await template.editMessageText()
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

const scene = new Scenes.WizardScene("sales", firstStep, secondStep)

module.exports = scene
