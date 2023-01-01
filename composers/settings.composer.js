const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/settings.controller")
const controller = new Controller()

composer.action(/settings_(.+)/, async ctx => await controller.settings(ctx))

composer.action(/wallet_(.+)/, async ctx => await controller.wallet(ctx))

composer.action(/language_(.+)/, async ctx => await controller.language(ctx))

composer.action(/currency_(.+)/, async ctx => await controller.currency(ctx))

module.exports = composer
