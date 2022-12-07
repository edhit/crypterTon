const { Composer, Scenes, Markup } = require("telegraf")
const randomstring = require("randomstring")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    let text = "search_scene_message"

    ctx.session.callback_query = randomstring.generate({
      length: 12,
      charset: "alphabetic",
    })

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
    let text
    let query
    let input = ctx.message.text

    query = await ctx.db.Product.find({
      $text: { $search: input },
      checks: "0",
      status: 0,
      user: { $ne: ctx.chat.id },
    })
      .sort({ createdAt: "desc" })
      .select("_id")

    ctx.session.ids = query

    if (query.length != 0) {
      let obj = {
        id: 0,
        media: 0,
        first: true,
      }
      let product = await ctx.helpers.template.product(ctx, obj)
      if (product == false) {
        text = "search_scene_nothingfound_error_checks"
        await ctx.replyWithHTML(ctx.i18n.t(text))
      }
      return
    }
    text = "search_scene_nothingfound_error_checks"

    await ctx.replyWithHTML(ctx.i18n.t(text))

    return
  } catch (e) {
    console.error(e)
  }
})

secondStep.on("callback_query", async ctx => {
  try {
    let data = []
    let query

    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    let row = 2
    let length = Math.ceil(update.update.length / row)

    for (let i = 0; i < length; i++) {
      const c = update.update.slice(i * row, i * row + row)
      data.push(c)
    }

    let entries = Object.fromEntries(new Map(data))

    let obj = {
      id: entries.product,
      media: entries.media,
      first: false,
    }

    switch (entries.action) {
      case "wishlist":
        query = await ctx.db.Wishlist.findOne({
          product: ctx.session.ids[entries.product]._id,
          user: ctx.chat.id,
        })
        if (query == null) {
          let wishlist = new ctx.db.Wishlist()
          wishlist.user = ctx.chat.id
          wishlist.product = ctx.session.ids[entries.product]._id
          await wishlist.save()
        } else {
          await query.delete()
        }
        break
      case "transaction":
        console.log("transaction")
        break
      default:
        console.log("default")
    }
    await ctx.helpers.template.product(ctx, obj)
    return
  } catch (e) {
    console.log(e)
  }
})

const scene = new Scenes.WizardScene("search", firstStep, secondStep)

scene.command(["/cancel", "/start"], async ctx => {
  try {
    await ctx.helpers.template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
