const { Composer, Markup } = require("telegraf")
const composer = new Composer()

composer.action(/addproduct_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    await ctx.scene.enter("addproduct")
  } catch (e) {
    console.error(e)
  }
})

composer.action(/myproducts_(.+)/, async ctx => {
  try {
    let update = await ctx.helpers.protect.callback(ctx)
    if (typeof update != "object") return

    await ctx.scene.enter("myproducts")
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
