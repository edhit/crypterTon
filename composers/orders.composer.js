const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/orders.controller")
const controller = new Controller()

composer.action(/orders_(.+)/, async ctx => await controller.orders(ctx))

composer.action(/purchases_(.+)/, async ctx => await controller.purchases(ctx))

composer.action(/sales_(.+)/, async ctx => await controller.sales(ctx))

module.exports = composer
