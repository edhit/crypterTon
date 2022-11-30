const { Composer, Markup } = require('telegraf')
const composer = new Composer();

composer.command('start', async (ctx) => {
  await ctx.helpers.template.start(ctx)
})

composer.command('cancel', async (ctx) => {
  await ctx.helpers.template.start(ctx)
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

composer.command('fake', async (ctx) => {
  const randomstring = require('randomstring')
  const randomSentence = require('random-sentence')
	try {
    let items = await ctx.helpers.mark.currency();
    for (let i = 0; i < 5; i++) {
      let product = new ctx.db.Product()
      product.user = ctx.chat.id
      product.shortId = randomstring.generate(7)
      product.name = randomSentence({words: 3})
      product.description = randomSentence({words: 11})
      product.tags = randomSentence({words: 10}) + ' tech'
      product.price = randomstring.generate({length: 2, charset: 'numeric'});
      product.currency = items[Math.floor(Math.random()*items.length)]
      product.status = 0
      product.media = [
        {
          fileId: 'AgACAgIAAxkBAAIZvGN7S7mhZ7_Fo4pAqw8cDkzkoGgwAAIzwTEbGNrZSzgvDZ5pXwPqAQADAgADeAADKwQ',
          type: 'photo'
        },
        {
          fileId: 'AgACAgIAAxkBAAIZvWN7S7nxs_Y3EoE8NrvFefolq-b6AAI0wTEbGNrZS6Osiq_X_NUwAQADAgADeAADKwQ',
          type: 'photo'
        },
        {
          fileId: 'AgACAgIAAxkBAAIZvmN7S7nNunniTaZbUHMlX4Y1jyYeAAI1wTEbGNrZSyRB8vQDPgyNAQADAgADeAADKwQ',
          type: 'photo'
        },
        {
          fileId: 'BAACAgIAAxkBAAIgB2N-tdCLU7LAgfs5oVObmQZyEmWSAAKyHwACv0f5S3sDzqXNGov3KwQ',
          type: 'video'
        },
      ]
      product.checks = '0'
      await product.save()
    }
	} catch (e) {
		console.error(e)
	}
})

module.exports = composer
