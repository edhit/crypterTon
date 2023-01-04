const Controller = require("./controller")

class Orders extends Controller {
  constructor() {
    super()
  }

  async orders(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("orders")
    } catch (e) {
      console.log(e)
    }
  }

  async purchases(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)
      // let order = await status.order()

      // let keyboard = []
      // let row = 1
      // let length = Math.ceil(order.length / row)
      // for (let i = 1; i < length; i++) {
      //   const c = order.slice(i * row, i * row + row)
      //   keyboard.push(
      //     c.map(name =>
      //       Markup.button.callback(
      //         name,
      //         "purchases_" + name + "_" + this.ctx.session.callback_query
      //       )
      //     )
      //   )
      // }
      await ctx.scene.enter("purchases")
    } catch (e) {
      console.log(e)
    }
  }

  async sales(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("sales")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Orders
