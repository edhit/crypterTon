const callback = async ctx => {
  try {
    let update = ctx.update.callback_query.data.split("_")
    let callback = update.pop()
    console.log(update)
    console.log(callback)

    if (callback != ctx.session.callback_query) throw "callback_query is old"
    await ctx.answerCbQuery(ctx.i18n.t("wait"), false)
    return {
      update: update,
      callback: callback,
    }
  } catch (e) {
    console.log(e)
    await ctx.answerCbQuery(e, false)
  }
}

module.exports = { callback }
