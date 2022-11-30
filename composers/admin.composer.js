const { Composer, Markup } = require('telegraf')
const composer = new Composer();

composer.command('admin', async (ctx) => {
  try {
    let text = 'admin__message';
    let keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.i18n.t('products'),
          'products'
        ),
        Markup.button.callback(
          ctx.i18n.t('profile'),
          'profile'
        )
      ],
			[
        Markup.button.callback(
          ctx.i18n.t('settings'),
          'settings'
        )
      ]
    ]);

    await ctx.replyWithHTML(
      ctx.i18n.t(text), {
        reply_markup: keyboard.reply_markup
      }
    );
  } catch (e) {
    console.log(e);
  }
})

composer.command('help', async (ctx) => {
	try {
		await ctx.replyWithHTML(`
/calc - Калькулятор
/pass - Генератор пароля
/stats - Статистика для админов
    `)
	} catch (e) {
		console.error(e)
	}
})

module.exports = composer
