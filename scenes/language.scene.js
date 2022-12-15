const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../helpers/template")
const Status = require("./../helpers/status")
const Protect = require("./../helpers/protect")

const template = new Template()
const status = new Status()
const protect = new Protect()

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    await protect.new(ctx)

    let text = "language_select_scene_message"

    let language = await status.language()

    let keyboard = []
    let row = 3
    let length = Math.ceil(language.length / row)
    for (let i = 0; i < length; i++) {
      const c = language.slice(i * row, i * row + row)
      keyboard.push(
        c.map(name =>
          Markup.button.callback(
            name,
            "language_" + name + "_" + ctx.session.callback_query
          )
        )
      )
    }

    keyboard = Markup.inlineKeyboard(keyboard)

    await ctx.editMessageText(ctx.i18n.t(text), {
      parse_mode: "HTML",
      reply_markup: keyboard.reply_markup,
    })

    return ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.action(/language_(.+)/, async ctx => {
  try {
    if (typeof (await protect.callback(ctx)) != "object") return
    let callback = await protect.callback(ctx)

    let text = "language_scene_success_checks"

    let query_user = await ctx.db.User.findOne({
      _id: ctx.session.user._id,
    })

    query_user.language = callback.update[1]
    await query_user.save()

    await ctx.editMessageText(ctx.i18n.t(text), {
      parse_mode: "HTML",
    })

    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("language", firstStep, secondStep)

scene.command(["/cancel"], async ctx => {
  try {
    // await ctx.helpers.template.start(ctx)
    return ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

module.exports = scene
