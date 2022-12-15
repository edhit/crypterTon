const Template = require("./../helpers/template")
const Protect = require("./../helpers/protect")

const template = new Template()
const protect = new Protect()

class Iteration {
  async buttons(ctx) {
    try {
      if (typeof (await protect.callback(ctx)) != "object") return
      let callback = await protect.callback(ctx)

      let data = []
      let row = 2
      let length = Math.ceil(callback.update.length / row)
      for (let i = 0; i < length; i++) {
        const c = callback.update.slice(i * row, i * row + row)
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
          let query_wishlist = await ctx.db.Wishlist.findOne({
            product: ctx.session.ids[obj.id]._id,
            user: ctx.session.user._id,
          })
          if (query_wishlist == null) {
            let wishlist = new ctx.db.Wishlist()
            wishlist.user = ctx.session.user._id
            wishlist.product = ctx.session.ids[obj.id]._id
            await wishlist.save()
          } else {
            await query_wishlist.delete()
          }
          await template.product(ctx, obj)
          break
        case "transaction":
          let query_product = await ctx.db.Product.findOne({
            _id: ctx.session.ids[obj.id]._id,
            status: 0,
          })

          if (query_product == null)
            await ctx.answerCbQuery(ctx.i18n.t("product_maybe_deleted"), false)
          else await template.transaction(ctx, obj)
          break
        default:
          await template.product(ctx, obj)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Iteration
