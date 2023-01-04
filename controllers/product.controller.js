const Controller = require("./controller")

class Product extends Controller {
  constructor() {
    super()
  }

  async addproduct(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("addproduct")
    } catch (e) {
      console.log(e)
    }
  }

  async myproducts(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      await this.protect.reset(ctx)
      await this.protect.new(ctx)

      await ctx.scene.enter("myproducts")
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Product
