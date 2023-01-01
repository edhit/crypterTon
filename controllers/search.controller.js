const Controller = require("./controller")

class Default extends Controller {
  constructor() {
    super()
  }

  async search(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await ctx.deleteMessage()

      await ctx.scene.enter("search")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Default
