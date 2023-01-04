const Controller = require("./controller")

class Settings extends Controller {
  constructor() {
    super()
  }

  async settings(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("settings")
    } catch (e) {
      console.log(e)
    }
  }

  async wallet(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("wallet")
    } catch (e) {
      console.log(e)
    }
  }

  async language(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("language")
    } catch (e) {
      console.log(e)
    }
  }

  async currency(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return

      await ctx.scene.enter("currency")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Settings
