const { Composer, Scenes, Markup } = require('telegraf')
const randomstring = require('randomstring')
const mongoose = require('mongoose')
require('dotenv').config()

const firstStep = new Composer()
firstStep.on('callback_query', async ctx => {
	try {
		let text
		let query

		ctx.session.callback_query = randomstring.generate({
		  length: 12,
		  charset: 'alphabetic'
		});

		query = await ctx.db.Wishlist.find({
			user: ctx.chat.id
		}).sort({createdAt: 'desc'}).select('product');

		let ids = []
		query.filter((item, index) => ids.push(mongoose.Types.ObjectId(query[index].product)))

		query = await ctx.db.Product.find({
			_id: {$in: ids}
		}).select('_id');

		ctx.session.ids = query

		if (query.length != 0) {
			let obj = {
				id: 0,
				media: 0,
				first: true,
			}
			let product = await ctx.helpers.template.product(ctx, obj);
			if (product == false) {
				text = 'wishlist_scene_nothingfound_error_checks'
				await ctx.editMessageText(ctx.i18n.t(text))
				return
			}
			return ctx.wizard.next()
		}
		text = 'wishlist_scene_nothingfound_error_checks'

    await ctx.editMessageText(ctx.i18n.t(text))

		return
	} catch (e) {
		console.error(e)
	}
})

const secondStep = new Composer()
secondStep.on('callback_query', async ctx => {
	try {
		let data = []
		let query

		let update = await ctx.helpers.protect.callback(ctx)
		if (typeof update != 'object') return

		let row = 2;
    let length = Math.ceil(update.update.length / row);

		for (let i = 0; i < length; i++) {
        const c = update.update.slice(i * row, i * row + row);
        data.push(c);
    }

		let entries = Object.fromEntries(new Map(data));

		let obj = {
			id: entries.product,
			media: entries.media,
			first: false,
		}

		switch (entries.action) {
		  case 'wishlist':
				query = await ctx.db.Wishlist.findOne({ product: ctx.session.ids[entries.product]._id, user: ctx.chat.id })
		    if (query == null) {
		      let wishlist = new ctx.db.Wishlist();
		  		wishlist.user = ctx.chat.id;
		  		wishlist.product = ctx.session.ids[entries.product]._id;
		      await wishlist.save();
		    } else {
					await query.delete();
				}
		    break;
		  case 'transaction':
		    query = await ctx.db.Product.findOne({ _id: ctx.session.ids[entries.product]._id, status: 0 })
				if (query == null) {
					await ctx.answerCbQuery(ctx.i18n.t('product_maybe_deleted'), false);
					return
		    }

				await ctx.helpers.template.transaction(ctx, obj);
				return
		    break;
		  default:
		    console.log('default');
		}
		await ctx.helpers.template.product(ctx, obj);
		return
	} catch (e) {
		console.log(e);
	}
});

const scene = new Scenes.WizardScene('wishlist', firstStep, secondStep)

scene.command(['/cancel', '/start'], async ctx => {
	try {
		await ctx.helpers.template.start(ctx)
		return ctx.scene.leave()
	} catch (e) {
		console.error(e)
	}
})


module.exports = scene
