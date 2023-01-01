require("dotenv").config()
const path = require("path")
const TelegrafI18n = require("telegraf-i18n")
const { Telegraf, Composer, Scenes, session } = require("telegraf")

const token = process.env.BOT_TOKEN
const bot = new Telegraf(token)

const { db } = require("./database")
const admin = [5781529295]

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  directory: path.resolve(__dirname, "locales"),
})
const stage = new Scenes.Stage([
  // require("./scenes/calc.scene"),
  require("./scenes/settings.scene"), // deleteMessage
  require("./scenes/orders.scene"), // deleteMessage
  require("./scenes/start.scene"), // deleteMessage
  require("./scenes/help.scene"),
  require("./scenes/wallet.scene"),
  require("./scenes/language.scene"),
  require("./scenes/currency.scene"),
  require("./scenes/addproduct.scene"), // deleteMessage
  require("./scenes/search.scene"), // same | // deleteMessage
  require("./scenes/wishlist.scene"), // same | // deleteMessage
  require("./scenes/myproducts.scene"), // same | // deleteMessage
  require("./scenes/purchases.scene"), // same
  require("./scenes/sales.scene"), // same
])

bot.context.db = db

bot.use(session())
bot.use(i18n.middleware())
bot.use(stage.middleware())
bot.use(require("./boot"))

bot.use(require("./composers/start.composer"))
bot.use(require("./composers/settings.composer"))
bot.use(require("./composers/product.composer"))
bot.use(require("./composers/search.composer"))
bot.use(require("./composers/wishlist.composer"))
bot.use(require("./composers/orders.composer"))
bot.use(Composer.acl(admin, require("./composers/admin.composer")))

bot.launch()
