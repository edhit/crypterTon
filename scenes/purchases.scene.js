const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/purchases.template")
const Scene = require("./scene")

const firstStep = new Composer()
firstStep.action(/purchases_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)

    let sorting = await template.sort.orders()

    template.query.order = await template.ctx.db.Order.find({
      user: template.ctx.session.user._id,
      payment_status: { $ne: 0 },
      status: sorting,
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
      return await template.ctx.wizard.next()
    }

    template.text = "purchases_scene_nothingfound_error_checks"

    await template.editMessageText()
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

secondStep.action(/sort_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return

    template.text = "sort_product_select_scene_message"

    let sort = await template.status.sort("orders")

    await template.generateButton(1, sort, "select")

    await template.editMessageText()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

secondStep.action(/select_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    let sorting = await template.sort.orders(callback.update[1])

    template.query.order = await template.ctx.db.Order.find({
      user: template.ctx.session.user._id,
      payment_status: { $ne: 0 },
      status: sorting,
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
      return await template.view()
    }

    await template.createButton(
      1,
      "callback",
      "sort",
      "sort_" + template.ctx.session.callback_query
    )

    template.text = "purchases_scene_nothingfound_error_checks"

    await template.editMessageText()
  } catch (e) {
    console.error(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const scene = new Scenes.WizardScene("purchases", firstStep, secondStep)

module.exports = scene
