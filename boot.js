// ids=the-open-network,bitcoin&vs_currencies=usd,rub
const boot = async (ctx, next) => {
  let session = await ctx.db.connection.startSession()
  await session.startTransaction()
  try {
    if (ctx.chat == undefined) throw "stop bot"
    // let handler = await ctx.helpers.handlerData(ctx);
    let query_user = await ctx.db.User.findOne({
      user: ctx.chat.id,
    })
    if (query_user == null) {
      user = new ctx.db.User()
      user.user = ctx.chat.id
      user.username = ctx.chat.username
      user.language = "eng"
      user.currency = "usd"
      user.refferal = 0
      user.ban = 0
      user.role = "user"
      query_user = user = await user.save()
    } else {
      if (query_user.username != ctx.chat.username) {
        query_user.username = ctx.chat.username
        query_user = await user.save()
      }
    }
    ctx.session.user = query_user
    ctx.i18n.locale(query_user.language)

    await next()
  } catch (e) {
    console.log(e)
  } finally {
    await session.commitTransaction()
    await session.endSession()
  }
}

module.exports = boot
