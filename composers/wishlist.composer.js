const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/wishlist.controller")
const controller = new Controller()

composer.action(/wishlist_(.+)/, async ctx => await controller.wishlist(ctx))

composer.command("wishlist", async ctx => await controller.command(ctx))

module.exports = composer
