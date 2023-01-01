const { Composer, Scenes, Markup } = require("telegraf")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.on("callback_query", async ctx => {
  try {
    const template = new Template(ctx)
    await template.protect.new(template.ctx)

    template.text = "currency_select_scene_message"
    let currency = await template.status.currency()

    template.keyboard = []
    let row = 3
    let length = Math.ceil(currency.length / row)
    for (let i = 0; i < length; i++) {
      const c = currency.slice(i * row, i * row + row)
      template.keyboard.push(
        c.map(name =>
          Markup.button.callback(
            name,
            "currency_" + name + "_" + template.ctx.session.callback_query
          )
        )
      )
    }

    template.keyboard = Markup.inlineKeyboard(template.keyboard)

    await template.editMessageText()

    return template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const secondStep = new Composer()
secondStep.action(/currency_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    template.text = "currency_scene_success_checks"

    template.query.user = await template.ctx.db.User.findOne({
      _id: template.ctx.session.user._id,
    })

    template.query.currency = callback.update[1]
    await template.query.user.save()

    await template.editMessageText()

    return template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene("currency", firstStep, secondStep)

module.exports = scene
