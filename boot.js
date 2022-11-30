// ids=the-open-network,bitcoin&vs_currencies=usd,rub
const boot = async (ctx, next) => {

  let session = await ctx.db.connection.startSession();
  await session.startTransaction();
  try {
    if (ctx.chat == undefined) throw 'stop bot';
    // let handler = await ctx.helpers.handlerData(ctx);
    let user = await ctx.db.User.findOne({
      user: ctx.chat.id
    });
    if (user == null) {
      user = new ctx.db.User();
      user.user = ctx.chat.id;
      user.username = ctx.chat.username;
      user.language = 'eng';
      user.currency = 'usd';
      user.refferal = 0;
      user.ban = 0;
      user.role = 'user';

      user = await user.save();
    } else {
      if (user.username != ctx.chat.username) {
        user.username = ctx.chat.username;
        user = await user.save();
      }
    }

    ctx.i18n.locale(user.language);

    await ctx.helpers.coingecko.update(ctx)

    await next();
  } catch (e) {
    console.log(e);
  } finally {
    await session.commitTransaction();
    await session.endSession();
  }
}

module.exports = boot