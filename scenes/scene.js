const Sales = require("../template/sales.template")
const Product = require("./../template/product.template")
const Transaction = require("./../template/transaction.template")
const Purchases = require("../template/purchases.template")

const Protect = require("./../helpers/protect")

class Scene {
  protect = new Protect()

  async buttons(ctx) {
    try {
      if (typeof (await this.protect.callback(ctx)) != "object") return
      let callback = await this.protect.callback(ctx)

      const product = new Product(ctx)
      const transaction = new Transaction(ctx)
      const sales = new Sales(ctx)
      const purchases = new Purchases(ctx)

      let data = []
      let row = 2
      let length = Math.ceil(callback.update.length / row)
      for (let i = 0; i < length; i++) {
        const c = callback.update.slice(i * row, i * row + row)
        data.push(c)
      }

      let entries = Object.fromEntries(new Map(data))
      console.log(entries)
      console.log(data)

      let obj = {
        id: entries.product,
        media: entries.media,
        first: false,
      }

      switch (entries.action) {
        case "wishlist":
          product.obj = obj

          product.query.wishlist = await product.ctx.db.Wishlist.findOne({
            product: product.ctx.session.ids[product.obj.id]._id,
            user: product.ctx.session.user._id,
          })
          if (product.query.wishlist == null) {
            let wishlist = new product.ctx.db.Wishlist()
            wishlist.user = product.ctx.session.user._id
            wishlist.product = product.ctx.session.ids[product.obj.id]._id
            await wishlist.save()
          } else {
            await product.query.wishlist.delete()
          }

          await product.view()
          break
        case "transaction":
          transaction.obj = obj

          transaction.query.product = await transaction.ctx.db.Product.findOne({
            _id: transaction.ctx.session.ids[transaction.obj.id]._id,
            status: 0,
          })

          if (transaction.query.product == null)
            await transaction.ctx.answerCbQuery(
              transaction.ctx.i18n.t("product_maybe_deleted"),
              false
            )
          await transaction.view()
          break
        case "change-product":
          product.obj = obj
          await product.view()
          break
        case "media":
          product.obj = obj
          await product.view()
          break
        case "canceltransation":
          product.obj = obj

          product.query.order = await product.ctx.db.Order.findOneAndDelete({
            product: product.ctx.session.ids[product.obj.id]._id,
            user: product.ctx.session.user._id,
            payment_status: 0,
          })

          await product.view()
          break
        case "change-purchase":
          purchases.obj = obj
          await purchases.view()
          break
        case "change-sales":
          sales.obj = obj
          await sales.view()
          break
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Scene
// // module.exports = Scene

// class Scene {
//   async start(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("start")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async addproduct(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("addproduct")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async myproducts(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("myproducts")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async search(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("search")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async wishlist(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("wishlist")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async orders(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("orders")
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   async settings(ctx) {
//     try {
//       ctx.scene.leave()
//       await ctx.scene.enter("settings")
//     } catch (e) {
//       console.error(e)
//     }
//   }
// }

// module.exports = Scene

// const Scene = require("./scene")
// const sc = new Scene()
// scene.command("/start", async ctx => await sc.start(ctx))
// scene.command("/addproduct", async ctx => await sc.addproduct(ctx))
// scene.command("/myproducts", async ctx => await sc.myproducts(ctx))
// scene.command("/search", async ctx => await sc.search(ctx))
// scene.command("/wishlist", async ctx => await sc.wishlist(ctx))
// scene.command("/orders", async ctx => await sc.orders(ctx))
// scene.command("/settings", async ctx => await sc.settings(ctx))
