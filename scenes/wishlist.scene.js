const { Composer, Scenes, Markup } = require("telegraf")
const mongoose = require("mongoose")

const Template = require("./../helpers/template")
const Protect = require("./../helpers/protect")
const Iteration = require("./../helpers/iteration")

const template = new Template()
const protect = new Protect()
const iteration = new Iteration()

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    await protect.new(ctx)
    await ctx.deleteMessage()

    let text

    let query_wishlist = await ctx.db.Wishlist.find({
      user: ctx.session.user._id,
    })
      .sort({ createdAt: "desc" })
      .select("product")

    let ids = []
    query_wishlist.filter((item, index) =>
      ids.push(mongoose.Types.ObjectId(query_wishlist[index].product))
    )

    let query_product = await ctx.db.Product.find({
      _id: { $in: ids },
    }).select("_id")

    ctx.session.ids = query_product

    if (query_product.length != 0) {
      let obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.product(ctx, obj)
      return ctx.wizard.next()
    }
    text = "wishlist_scene_nothingfound_error_checks"

    await ctx.replyWithHTML(ctx.i18n.t(text))
  } catch (e) {
    console.error(e)
    await template.start(ctx)
  }
})

const secondStep = new Composer()
secondStep.on("callback_query", async ctx => {
  try {
    await iteration.buttons(ctx)
  } catch (e) {
    console.log(e)
  }
})

const scene = new Scenes.WizardScene("wishlist", firstStep, secondStep)

scene.command(["/cancel"], async ctx => {
  try {
    // await ctx.helpers.template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
