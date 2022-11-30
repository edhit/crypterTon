const { Composer, Scenes, Markup } = require('telegraf')
const randomstring = require('randomstring')

const firstStep = new Composer()
firstStep.on('callback_query', async ctx => {
	try {
		let text = 'currency_select_scene_message';
		let keyboard = []

		ctx.session.callback_query = randomstring.generate({
		  length: 12,
		  charset: 'alphabetic'
		});

		let currency = await ctx.helpers.mark.currency();

		let row = 3;
    let length = Math.ceil(currency.length / row);

		for (let i = 0; i < length; i++) {
        const c = currency.slice(i * row, i * row + row);
        keyboard.push(c.map(name => Markup.button.callback(name, 'currency_' + name + '_' + ctx.session.callback_query)));
    }

		keyboard = Markup.inlineKeyboard(keyboard)

    await ctx.editMessageText(
      ctx.i18n.t(text), {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    )

		return ctx.wizard.next()
	} catch (e) {
		console.error(e)
	}
})

const secondStep = new Composer()
secondStep.action(/currency_(.+)/, async ctx => {
	try {
		let text = 'currency_scene_success_checks'

		let update = await ctx.helpers.protect.callback(ctx)
		if (typeof update != 'object') return

		let user = await ctx.db.User.findOne({
      user: ctx.chat.id
    })

		user.currency = update.update[1]
    await user.save()

    await ctx.editMessageText(ctx.i18n.t(text), {
			parse_mode: 'HTML'
		})

		return ctx.scene.leave()
	} catch (e) {
		console.error(e)
	}
})

const scene = new Scenes.WizardScene('currency', firstStep, secondStep)

scene.command(['/cancel', '/start'], async ctx => {
	try {
		await ctx.helpers.template.start(ctx)
		return ctx.scene.leave()
	} catch (e) {
		console.error(e)
	}
})


module.exports = scene
