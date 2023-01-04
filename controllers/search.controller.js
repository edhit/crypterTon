const Controller = require("./controller")

class Search extends Controller {
  constructor() {
    super()
  }

  async search(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("search")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Search
