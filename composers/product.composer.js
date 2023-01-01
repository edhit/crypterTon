const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/product.controller")
const controller = new Controller()

composer.action(
  /addproduct_(.+)/,
  async ctx => await controller.addproduct(ctx)
)

composer.action(
  /myproducts_(.+)/,
  async ctx => await controller.myproducts(ctx)
)

module.exports = composer
