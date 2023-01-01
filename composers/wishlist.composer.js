const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/wishlist.controller")
const controller = new Controller()

composer.action(/wishlist_(.+)/, async ctx => await controller.wishlist(ctx))

module.exports = composer
