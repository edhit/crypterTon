const Protect = require("./../helpers/protect")

class Controller {
  protect = new Protect()

  async command(ctx) {
    try {
      await this.protect.reset(ctx)
      await this.protect.new(ctx)
      let command = ctx.update.message.text.substring(1).split(" ")

      if (command.length > 1) {
        ctx.session.param = command[1]
      }

      await ctx.scene.enter(command[0])
    } catch (e) {
      console.log(e)
    }
  }

  constructor() {}
}

module.exports = Controller
