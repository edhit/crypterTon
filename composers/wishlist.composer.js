const { Composer, Markup } = require('telegraf')
const composer = new Composer();

composer.action(/wishlist_(.+)/, async (ctx) => {
	try {
		let update = await ctx.helpers.protect.callback(ctx)
		if (typeof update != 'object') return

		await ctx.scene.enter('wishlist')
	} catch (e) {
		console.error(e)
	}
})

module.exports = composer
