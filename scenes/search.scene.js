const { Composer, Scenes, Markup } = require("telegraf")
const randomstring = require("randomstring")

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

    let text = "search_scene_message"

    await ctx.editMessageText(ctx.i18n.t(text), {
      parse_mode: "HTML",
    })

    return ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.on("text", async ctx => {
  try {
    await protect.new(ctx)

    let text
    let input = ctx.message.text

    let query_product = await ctx.db.Product.find({
      $text: { $search: input },
      checks: "0",
      status: 0,
      user: { $ne: ctx.session.user._id },
    })
      .sort({ createdAt: "desc" })
      .select("_id")
      .limit(75)

    ctx.session.ids = query_product

    if (query_product.length != 0) {
      let obj = {
        id: 0,
        media: 0,
        first: true,
      }
      await template.product(ctx, obj)
      return
    }
    text = "search_scene_nothingfound_error_checks"

    await ctx.replyWithHTML(ctx.i18n.t(text))
  } catch (e) {
    console.error(e)
    await template.start(ctx)
  }
})

secondStep.on("callback_query", async ctx => {
  try {
    await iteration.buttons(ctx)
  } catch (e) {
    console.log(e)
  }
})

const scene = new Scenes.WizardScene("search", firstStep, secondStep)

scene.command(["/cancel"], async ctx => {
  try {
    // await ctx.helpers.template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
