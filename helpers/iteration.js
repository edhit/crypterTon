// const Protect = require("./../helpers/protect")

// const Product = require("./../template/product.template")
// const Purchases = require("./../template/purchases.template")
// const Sales = require("./../template/sales.template")
// const Transaction = require("./../template/transaction.template")

// const protect = new Protect()

// class Iteration {
//   async buttons(ctx) {
//     try {
//       if (typeof (await protect.callback(ctx)) != "object") return
//       let callback = await protect.callback(ctx)

//       const product = new Product()
//       const purchases = new Purchases()
//       const sales = new Sales()
//       const transaction = new Transaction()

//       let data = []
//       let row = 2
//       let length = Math.ceil(callback.update.length / row)
//       for (let i = 0; i < length; i++) {
//         const c = callback.update.slice(i * row, i * row + row)
//         data.push(c)
//       }

//       let entries = Object.fromEntries(new Map(data))
//       console.log(entries)
//       console.log(data)
//       let obj = {
//         id: entries.product,
//         media: entries.media,
//         first: false,
//       }

//       switch (entries.action) {
//         case "wishlist":
//           product.ctx = ctx
//           product.obj = obj

//           product.query.wishlist = await ctx.db.Wishlist.findOne({
//             product: ctx.session.ids[obj.id]._id,
//             user: ctx.session.user._id,
//           })
//           if (product.query.wishlist == null) {
//             let wishlist = new ctx.db.Wishlist()
//             wishlist.user = ctx.session.user._id
//             wishlist.product = ctx.session.ids[obj.id]._id
//             await wishlist.save()
//           } else {
//             await product.query.wishlist.delete()
//           }

//           await product.view()
//           break
//         case "transaction":
//           transaction.ctx = ctx
//           transaction.obj = obj
//           transaction.query.product = await ctx.db.Product.findOne({
//             _id: ctx.session.ids[obj.id]._id,
//             status: 0,
//           })

//           if (transaction.query.product == null)
//             await ctx.answerCbQuery(ctx.i18n.t("product_maybe_deleted"), false)
//           else await transaction.view()
//           break
//         case "change-product":
//           product.ctx = ctx
//           product.obj = obj
//           await product.view()
//           break
//         case "media":
//           product.ctx = ctx
//           product.obj = obj
//           await product.view()
//           break
//         case "canceltransation":
//           product.ctx = ctx
//           product.obj = obj
//           await product.view()
//           break
//         case "change-purchase":
//           purchases.ctx = ctx
//           purchases.obj = obj
//           await purchases.view()
//           break
//         case "change-sales":
//           sales.ctx = ctx
//           sales.obj = obj
//           await sales.view()
//           break
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }

// module.exports = Iteration
