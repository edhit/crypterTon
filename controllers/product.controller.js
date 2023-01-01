const Controller = require("./controller")

class Default extends Controller {
  constructor() {
    super()
  }

  async addproduct(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await ctx.deleteMessage()

      await ctx.scene.enter("addproduct")
    } catch (e) {
      console.log(e)
    }
  }

  async myproducts(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return

      await ctx.scene.enter("myproducts")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Default
