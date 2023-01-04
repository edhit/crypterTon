const Controller = require("./controller")

class Wishlist extends Controller {
  constructor() {
    super()
  }

  async wishlist(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("wishlist")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Wishlist
