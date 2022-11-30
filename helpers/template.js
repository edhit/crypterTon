const { Markup } = require('telegraf')
const randomstring = require('randomstring')
require('dotenv').config()

const start = async ctx => {
  try {
    console.log(ctx.session);
    Object.keys(ctx.session).forEach(function (prop) {
      delete ctx.session[prop];
    })

    ctx.session.callback_query = randomstring.generate({
		  length: 12,
		  charset: 'alphabetic'
		});

    let text = 'start__message';
    let keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.i18n.t('addproduct'),
          'addproduct_' + ctx.session.callback_query
        ),
        Markup.button.callback(
          ctx.i18n.t('myproducts'),
          'myproducts_' + ctx.session.callback_query
        )
      ],
      [
        Markup.button.callback(
          ctx.i18n.t('search'),
          'search_' + ctx.session.callback_query
        ),
        Markup.button.callback(
          ctx.i18n.t('wishlist'),
          'wishlist_' + ctx.session.callback_query
        )
      ],
      [
        Markup.button.callback(
          ctx.i18n.t('orders'),
          'orders_' + ctx.session.callback_query
        ),
        Markup.button.callback(
          ctx.i18n.t('deals'),
          'deals_' + ctx.session.callback_query
        )
      ],
			[
        Markup.button.callback(
          ctx.i18n.t('settings'),
          'settings_' + ctx.session.callback_query
        )
      ]
    ]);

    await ctx.replyWithHTML(
      ctx.i18n.t(text), {
        reply_markup: keyboard.reply_markup
      }
    );
    return
  } catch (e) {
    console.log(e);
  }
}

const product = async (ctx, obj) => {
  // id, photo, first = false
  try {
    let text
    let keyboard = Markup.inlineKeyboard([
      [],
      [],
      [],
    ]);

    let query_product = await ctx.db.Product.findOne({ _id: ctx.session.ids[obj.id]._id })
    if (query_product == null) {
      return false
    }
    let query_seller = await ctx.db.User.findOne({ user: query_product.user });
    let query_user = await ctx.db.User.findOne({ user: ctx.chat.id });
    let query_wishlist = await ctx.db.Wishlist.findOne({ product: ctx.session.ids[obj.id]._id, user: ctx.chat.id });
    let query_general = await ctx.db.General.findOne({id: process.env.GENERAL_ID})

    if (ctx.session.ids.length > 1) {
      if (obj.id == 0) {
        keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            '➡️',
            'product_' + (parseInt(obj.id) + 1) + '_media_0_action_change_' + ctx.session.callback_query
          )
        );
      } else if (obj.id > 0 && obj.id < parseInt(ctx.session.ids.length) - 1) {
        keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            '⬅️',
            'product_' + (parseInt(obj.id) - 1) + '_media_0_action_change_' + ctx.session.callback_query
          )
        );
        keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            '➡️',
            'product_' + (parseInt(obj.id) + 1) + '_media_0_action_change_' + ctx.session.callback_query
          )
        );
      } else {
        keyboard.reply_markup.inline_keyboard[2].push(
          Markup.button.callback(
            '⬅️',
            'product_' + (parseInt(obj.id) - 1) + '_media_0_action_change_' + ctx.session.callback_query
          )
        );
      }
    }

    if (query_product.status == 0 && query_product.user != ctx.chat.id) {
      keyboard.reply_markup.inline_keyboard[1].push(
        Markup.button.callback(
          '💰 ' + ctx.i18n.t('buy'),
          'product_' + obj.id + '_media_' + obj.media + '_action_transaction_' + ctx.session.callback_query
        )
      );
    }

    if (query_product.user != ctx.chat.id) {
      if (query_wishlist == null) {
        keyboard.reply_markup.inline_keyboard[1].push(
          Markup.button.callback(
            '❤️ ' + ctx.i18n.t('addtowishlist'),
            'product_' + obj.id + '_media_' + obj.media + '_action_wishlist_' + ctx.session.callback_query
          )
        );
      } else {
        keyboard.reply_markup.inline_keyboard[1].push(
          Markup.button.callback(
            '💔 ' + ctx.i18n.t('deletefromwishlist'),
            'product_' + obj.id + '_media_' + obj.media + '_action_wishlist_' + ctx.session.callback_query
          )
        );
      }
    }

    if (query_product.status == 0 && query_product.user != ctx.chat.id) {
      keyboard.reply_markup.inline_keyboard[1].push(
        Markup.button.url(
          ctx.i18n.t('sendMessage'),
          'https://t.me/' + query_seller.username
        )
      )
    }

    let tags = []
    query_product.tags.split(' ').filter((item, index) => tags.push('#' + query_product.tags.split(' ')[index]))

    if (query_product.media.length > 1) {
      let icon
      let callback
      for (let i = 0; i < query_product.media.length; i++) {
        if (i == obj.media) {
          icon = '🟢'
          callback = 'same'
        } else {
          icon = '🌌'
          callback = ctx.session.callback_query
        }
        keyboard.reply_markup.inline_keyboard[0].push(
          Markup.button.callback(
            icon,
            'product_' + obj.id + '_media_' + i + '_action_media_' + callback
          )
        );
      }
    }

    let rounding = 5
    let convert = {
      price: query_product.price,
      currency: (query_product.currency).toUpperCase(),
      btc: (query_product.price / query_general.coins.bitcoin[query_product.currency]).toFixed(rounding),
      ton: (query_product.price / query_general.coins['the-open-network'][query_product.currency]).toFixed(rounding)
    }
    if (query_product.currency == query_user.currency) {
      convert.price = (query_product.price).toFixed(rounding) + ' ' + convert.currency + ' \n   ' + convert.btc + ' BTC \n   ' + convert.ton + ' TON'
    } else {
      if (query_product.currency != 'usd') {
          convert.price = query_product.price * query_general.coins.usd[query_user.currency];
          convert.price = (convert.price / query_general.coins.usd[query_product.currency]).toFixed(rounding);
      } else {
        convert.price = (query_product.price * query_general.coins.usd[query_user.currency]).toFixed(rounding);
      }
      // console.log(query_user.currency);
      convert.currency = (query_user.currency).toUpperCase()
      convert.price = convert.price + ' ' + convert.currency + ' \n   ' + convert.btc + ' BTC \n   ' + convert.ton + ' TON'
    }
    console.log(query_product.price + ' ' + query_product.currency);

    let status = await ctx.helpers.mark.status()

    let post = "<b>🔥️ " +
     query_product.name + "</b>\n📝 " +
     query_product.description + "\n<pre>🏷️ " +
     convert.price + "</pre>\n#️⃣ " +
     tags.join(' ') + "\n🌌 " + query_product.media.length + ' ' + ctx.i18n.t('medias') + "\n ⚡️" +
     ctx.i18n.t(status[query_product.status])

    if (obj.first == false) {
      await ctx.editMessageMedia(
        {
          type: query_product.media[obj.media].type,
          media: query_product.media[obj.media].fileId,
          caption: post,
          parse_mode: 'HTML',
        },
        {
          reply_markup: keyboard.reply_markup,
        }
      );
      return
    } else {
      let extra = {
        caption: post,
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
      if (query_product.media[obj.media].type == 'photo') {
        console.log('photo');
        await ctx.sendPhoto(
          query_product.media[obj.media].fileId, extra
        );
        return
      }
      if (query_product.media[obj.media].type == 'video') {
        console.log('video');
        await ctx.sendVideo(
          query_product.media[obj.media].fileId, extra
        );
        return
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const transaction = async (ctx, obj) => {
  try {
    let text
    let keyboard = Markup.inlineKeyboard([]);

    let keyPair = await ctx.helpers.payments.createKeyPair()
    console.log(keyPair);
    let address = await ctx.helpers.payments.createWallet(keyPair.keyPair)
    console.log(address);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  start,
  product,
  transaction
 }
