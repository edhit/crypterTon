const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/product.template")
const Scene = require("./scene")

const firstStep = new Composer()
firstStep.action(/search_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "search_scene_message"

    await template.editMessageText()

    return template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

firstStep.command("search", async ctx => {
  try {
    const template = new Template(ctx)

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
    await template.protect.new(ctx)

    let sorting = await template.sort.product()

    template.ctx.session.input = template.ctx.message.text

    template.query.product = await template.ctx.db.Product.find({
      $text: { $search: template.ctx.session.input },
      status: 0,
      user: { $ne: template.ctx.session.user._id },
    })
      .sort(sorting)
      .select("_id")
      .limit(75)

    template.ctx.session.ids = template.query.product

    if (template.query.product.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      return await template.view()
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
    await ctx.deleteMessage()

    template.text = "sort_product_select_scene_message"

    let sort = await template.status.sort("product")

    await template.generateButton(1, sort, "select")

    await template.replyWithHTML()
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
    await ctx.deleteMessage()

    let sorting = await template.sort.product(callback.update[1])

    template.query.product = await template.ctx.db.Product.find({
      $text: { $search: template.ctx.session.input },
      status: 0,
      user: { $ne: template.ctx.session.user._id },
    })
      .sort(sorting)
      .select("_id")
      .limit(75)

    template.ctx.session.ids = template.query.product

    if (template.query.product.length != 0) {
      template.obj = {
        id: 0,
        media: 0,
        first: true,
      }
      return await template.view()
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

const scene = new Scenes.WizardScene("search", firstStep, secondStep)

// const controller = new Controller()
// scene.command("start", async ctx => await controller.command(ctx))
// scene.command("addproduct", async ctx => await controller.command(ctx))
// scene.command("myproducts", async ctx => await controller.command(ctx))
// scene.command("search", async ctx => await controller.command(ctx))
// scene.command("wishlist", async ctx => await controller.command(ctx))
// scene.command("orders", async ctx => await controller.command(ctx))
// scene.command("settings", async ctx => await controller.command(ctx))

module.exports = scene
