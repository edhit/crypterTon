const { Composer, Markup } = require("telegraf")
const composer = new Composer()

const Controller = require("./../controllers/start.controller")
const controller = new Controller()

composer.command("start", async ctx => await controller.start(ctx))

composer.command("help", async ctx => await controller.help(ctx))

composer.command("fakes", async ctx => {
  const randomstring = require("randomstring")
  const res = await ctx.db.Product.updateMany({
    delivery: randomstring.generate({
      length: 2,
      charset: "numeric",
    }),
  })
})

composer.command("fake", async ctx => {
  const randomstring = require("randomstring")
  const randomSentence = require("random-sentence")
  const { v4: uuidv4 } = require("uuid")

  try {
    let items = await status.currency()
    for (let i = 0; i < 5; i++) {
      let product = new ctx.db.Product()
      product.user = ctx.session.user._id
      product.uuid = uuidv4()
      product.name = randomSentence({ words: 3 })
      product.description = randomSentence({ words: 11 })
      product.tags = randomSentence({ words: 10 }) + " tech"
      product.price = randomstring.generate({
        length: 2,
        charset: "numeric",
      })
      product.delivery = randomstring.generate({
        length: 2,
        charset: "numeric",
      })
      product.count = randomstring.generate({
        length: 2,
        charset: "numeric",
      })
      product.currency = items[Math.floor(Math.random() * items.length)]
      product.status = 0
      product.media = [
        {
          fileId:
            "AgACAgIAAxkBAAMiY5-Dw8rnrOcafF-dbyQaOke3paoAAifNMRtoY_lIARwhOXrHreEBAAMCAAN5AAMsBA",
          type: "photo",
        },
        {
          fileId:
            "AgACAgIAAxkBAAMjY5-Dw3QWLmrRPPDBlUmMFQ1WuscAAifNMRtoY_lIARwhOXrHreEBAAMCAAN5AAMsBA",
          type: "photo",
        },
        {
          fileId:
            "AgACAgIAAxkBAAMkY5-Dw3vVSngPtSAjO7grVsK6TWoAAifNMRtoY_lIARwhOXrHreEBAAMCAAN5AAMsBA",
          type: "photo",
        },
        {
          fileId:
            "AgACAgIAAxkBAAMlY5-DwxIDUoZisE-DbgnBVgjOaLIAAijNMRtoY_lITNgwaQlzm5gBAAMCAAN5AAMsBA",
          type: "photo",
        },
      ]
      await product.save()
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer
