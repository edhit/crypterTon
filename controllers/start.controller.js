const Controller = require("./controller")

// const Start = require("./../template/start.template")
// const Help = require("./../template/help.template")

class Default extends Controller {
  constructor() {
    super()
  }

  async start(ctx) {
    try {
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("start")
    } catch (e) {
      console.log(e)
    }
  }

  async help(ctx) {
    try {
      await ctx.scene.enter("help")
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = Default
