const callback = async ctx => {
  try {
    let update = ctx.update.callback_query.data.split('_')
		let callback = update.pop()
    console.log(update);
    console.log(callback);

		if (callback != ctx.session.callback_query) throw 'callback_query is old'

    return {
      update: update,
      callback: callback
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { callback }
