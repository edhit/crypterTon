const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/purchases.template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.query.order = await template.ctx.db.Order.find({
      user: template.ctx.session.user._id,
      payment_status: { $ne: 0 },
    })
      .sort({ createdAt: "desc" })
      .select("product")
      .populate({
        path: "product",
        select: "_id",
      })

    let ids = []
    template.query.order.filter((item, index) =>
      ids.push(template.query.order[index].product)
    )

    template.ctx.session.ids = ids

    if (ids.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.view()
      return template.ctx.wizard.next()
    }
    template.text = "purchases_scene_nothingfound_error_checks"

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

const scene = new Scenes.WizardScene("purchases", firstStep, secondStep)

module.exports = scene
