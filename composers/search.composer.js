const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/search.controller")
const controller = new Controller()

composer.action(/search_(.+)/, async ctx => await controller.search(ctx))

composer.command("search", async ctx => await controller.command(ctx))

module.exports = composer
