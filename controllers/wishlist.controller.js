const Controller = require("./controller")

class Default extends Controller {
  constructor() {
    super()
  }

  async wishlist(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await ctx.deleteMessage()

      await ctx.scene.enter("wishlist")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Default
