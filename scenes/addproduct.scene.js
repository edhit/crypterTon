const { Composer, Scenes, Markup } = require('telegraf')
const validator = require("validator")
const randomstring = require('randomstring')
const moment = require('moment')

const firstStep = new Composer()
firstStep.on('callback_query', async ctx => {
	try {
		let text = 'addproduct_scene_photo_message';

		ctx.session.callback_query = randomstring.generate({
		  length: 12,
		  charset: 'alphabetic'
		});

		ctx.session.startdate = moment()
		ctx.wizard.state.data = {}

		if (ctx.wizard.state.data.media == undefined) {
			ctx.wizard.state.data.media = []
		}

    await ctx.editMessageText(
      ctx.i18n.t(text), {
        parse_mode: 'HTML',
      }
    )

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const secondStep = new Composer()
secondStep.on('photo', async ctx => {
	try {
		let text = 'addproduct_scene_photo_success_checks'
		let keyboard = Markup.keyboard([
	    ['upload']
	  ]).oneTime().resize();

		let file = ctx.update.message.photo
		let fileId = file[file.length - 1].file_id

		if (ctx.wizard.state.data.media.length > 7) {
			text = 'addproduct_scene_media_many_error_checks'
			await ctx.replyWithHTML(
				ctx.i18n.t(text), {
					reply_markup: keyboard.reply_markup
				}
			)
			return
		}

		ctx.wizard.state.data.media.push({fileId: fileId, type: 'photo'})

		await ctx.replyWithHTML(
			ctx.i18n.t(text), {
				reply_markup: keyboard.reply_markup
			}
		)
		return
	} catch (e) {
		console.log(e);
	}
})

secondStep.on('video', async ctx => {
	try {
		let text = 'addproduct_scene_video_success_checks'
		let keyboard = Markup.keyboard([
	    ['upload']
	  ]).oneTime().resize();

		let file = ctx.update.message.video
		let fileId = file.file_id

		if (ctx.wizard.state.data.media.length > 9) {
			text = 'addproduct_scene_media_many_error_checks'
			await ctx.replyWithHTML(
				ctx.i18n.t(text), {
					reply_markup: keyboard.reply_markup
				}
			)
			return
		}

		ctx.wizard.state.data.media.push({fileId: fileId, type: 'video'})

		await ctx.replyWithHTML(
			ctx.i18n.t(text), {
				reply_markup: keyboard.reply_markup
			}
		)
		return
	} catch (e) {
		console.log(e);
	}
})

secondStep.hears('upload', async ctx => {
	try {
		let text = 'addproduct_scene_name_message'

		if (ctx.wizard.state.data.media == undefined) {
			text = 'addproduct_scene_photo_empty_error_checks'
			await ctx.replyWithHTML(
				ctx.i18n.t(text), {
					reply_markup: keyboard.reply_markup
				}
			)
			return
		}

		await ctx.replyWithHTML(ctx.i18n.t(text), {
			reply_markup: {remove_keyboard: true}
		})

		return ctx.wizard.next()
	} catch (e) {
		console.log(e);
	}
})

const thirdStep = new Composer()
thirdStep.on('text', async ctx => {
	try {
		let text = 'addproduct_scene_description_message'
		let input = ctx.message.text

		if (!validator.isLength(input, {min:1, max: 100})) {
      text = 'addproduct_scene_name_length_error_checks'
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return;
    }
		ctx.wizard.state.data.name = input

		await ctx.replyWithHTML(ctx.i18n.t(text))

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const fourthStep = new Composer()
fourthStep.on('text', async ctx => {
	try {
		let text = 'addproduct_scene_tags_message'
		let input = ctx.message.text

		if (!validator.isLength(input, {min:1, max: 255})) {
      text = 'addproduct_scene_description_length_error_checks'
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return;
    }
		ctx.wizard.state.data.description = input

		await ctx.replyWithHTML(ctx.i18n.t(text))

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const fifthStep = new Composer()
fifthStep.on('text', async ctx => {
	try {
		let text = 'addproduct_scene_price_message'
		let input = ctx.message.text

		if (input.split(' ').length > 10) {
      text = 'addproduct_scene_tags_length_error_checks'
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return;
    }
		ctx.wizard.state.data.tags = input

		await ctx.replyWithHTML(ctx.i18n.t(text))

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const sixthStep = new Composer()
sixthStep.on('text', async ctx => {
	try {
		let text = 'addproduct_currency_product_message'
		let input = ctx.message.text
		let keyboard = []

		let currency = await ctx.helpers.mark.currency();

		let row = 3;
    let length = Math.ceil(currency.length / row);

		for (let i = 0; i < length; i++) {
        const c = currency.slice(i * row, i * row + row);
        keyboard.push(c.map(name => Markup.button.callback(name, 'currency_' + name + '_' + ctx.session.callback_query)));
    }

		keyboard = Markup.inlineKeyboard(keyboard)

		if (!validator.isFloat(input) || !validator.isNumeric(input)) {
      text = 'addproduct_scene_price_numericfloat_error_checks'
      await ctx.replyWithHTML(ctx.i18n.t(text))
      return;
    }

		ctx.wizard.state.data.price = input

		await ctx.replyWithHTML(
      ctx.i18n.t(text), {
        reply_markup: keyboard.reply_markup
      }
    )

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const seventhStep = new Composer()
seventhStep.action(/currency_(.+)/, async ctx => {
	try {
		let text = 'addproduct_confirm_product_message'

		let update = await ctx.helpers.protect.callback(ctx)
		if (typeof update != 'object') return

		let keyboard = Markup.inlineKeyboard([
	    [
	      Markup.button.callback(
	        ctx.i18n.t('yes'),
	        'confirm_yes_' + ctx.session.callback_query
	      ),
	      Markup.button.callback(
	        ctx.i18n.t('no'),
	        'confirm_no_' + ctx.session.callback_query
	      )
	    ]
		]);

		ctx.wizard.state.data.currency = update.update[1]

		await ctx.editMessageText(
      ctx.i18n.t(text), {
        reply_markup: keyboard.reply_markup
      }
    )

		return ctx.wizard.next()
	} catch (e) {
		console.log(e);
	}
})

const eighthStep = new Composer()
eighthStep.action(/confirm_(yes|no)_(.+)/, async ctx => {
	try {
		let text
		let checks = []

		let update = await ctx.helpers.protect.callback(ctx)
		if (typeof update != 'object') return

		if (update.update[1] == 'yes') {

			if (await ctx.helpers.phone.match(ctx.wizard.state.data.name) != null) checks.push(1)
			if (await ctx.helpers.phone.match(ctx.wizard.state.data.description) != null) checks.push(2)
			if (await ctx.helpers.phone.match(ctx.wizard.state.data.tags) != null) checks.push(3)

			if (await ctx.helpers.url.match(ctx.wizard.state.data.name) != null) checks.push(4)
			if (await ctx.helpers.url.match(ctx.wizard.state.data.description) != null) checks.push(5)
			if (await ctx.helpers.url.match(ctx.wizard.state.data.tags) != null) checks.push(6)

			if (ctx.session.startdate.add('20', 'h').valueOf() > moment().valueOf()) {
				let product = new ctx.db.Product()
				product.user = ctx.chat.id
				product.shortId = randomstring.generate(7)
				product.name = ctx.wizard.state.data.name.replace(/  +/g, ' ')
				product.description = ctx.wizard.state.data.description.replace(/  +/g, ' ')
				product.tags = ctx.wizard.state.data.tags.replace(/  +/g, ' ')
				product.price = ctx.wizard.state.data.price.replace(/  +/g, ' ')
				product.media = ctx.wizard.state.data.media
				product.status = 1
				product.currency = ctx.wizard.state.data.currency
				product.checks = (checks.length > 0) ? checks.join(',') : '0'
				console.log(product);
				await product.save()
				text = 'addproduct_scene_success_checks'
			} else {
				text = 'addproduct_scene_alotoftime_error_checks'
			}
		} else {
			text = 'addproduct_scene_cancel_checks'
		}

		await ctx.editMessageText(ctx.i18n.t(text))

		return ctx.scene.leave()
	} catch (e) {
		console.error(e)
	}
})

const scene = new Scenes.WizardScene('addproduct', firstStep, secondStep, thirdStep, fourthStep, fifthStep, sixthStep, seventhStep, eighthStep)

scene.command(['/cancel', '/start'], async ctx => {
	try {
		await ctx.helpers.template.start(ctx)
		return ctx.scene.leave()
	} catch (e) {
		console.error(e)
	}
})


module.exports = scene
