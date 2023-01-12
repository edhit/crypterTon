const { Composer, Scenes, Markup } = require("telegraf")
const validator = require("validator")
const moment = require("moment")

const Template = require("./../template/template")

const firstStep = new Composer()
firstStep.action(/addproduct_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    await ctx.deleteMessage()

    template.text = "addproduct_scene_media_message"

    template.ctx.session.startdate = moment()
    template.ctx.wizard.state.data = {}

    if (template.ctx.wizard.state.data.media == undefined) {
      template.ctx.wizard.state.data.media = []
    }

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.log(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

firstStep.command("addproduct", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_media_message"

    template.ctx.session.startdate = moment()
    template.ctx.wizard.state.data = {}

    if (template.ctx.wizard.state.data.media == undefined) {
      template.ctx.wizard.state.data.media = []
    }

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.log(e)
    const template = new Template(ctx)

    await template.canceled()
    await template.ctx.scene.leave()
  }
})

const secondStep = new Composer()
secondStep.on("photo", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_photo_success_checks" //upload

    let file = template.ctx.update.message.photo
    let fileId = file[file.length - 1].file_id

    if (template.ctx.wizard.state.data.media.length > 7) {
      template.text = "addproduct_scene_media_many_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.media.push({ fileId: fileId, type: "photo" })

    await template.replyWithHTML()
  } catch (e) {
    console.log(e)
  }
})

secondStep.on("video", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_video_success_checks" // upload

    let file = template.ctx.update.message.video
    let fileId = file.file_id

    if (template.ctx.wizard.state.data.media.length > 9) {
      template.text = "addproduct_scene_media_many_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.media.push({ fileId: fileId, type: "video" })

    await template.replyWithHTML()
  } catch (e) {
    console.log(e)
  }
})

secondStep.command("/upload", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_name_message"

    if (template.ctx.wizard.state.data.media.length == 0) {
      template.text = "addproduct_scene_media_empty_error_checks"

      return await template.replyWithHTML()
    }

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.log(e)
  }
})

const thirdStep = new Composer()
thirdStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_description_message"
    let input = template.ctx.message.text

    if (!validator.isLength(input, { min: 1, max: 100 })) {
      template.text = "addproduct_scene_name_length_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.phone(input)) != null) {
      template.text = "addproduct_scene_name_checker_phone_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.url(input)) != null) {
      template.text = "addproduct_scene_name_checker_url_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.name = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const fourthStep = new Composer()
fourthStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_tags_message"
    let input = template.ctx.message.text

    if (!validator.isLength(input, { min: 1, max: 255 })) {
      template.text = "addproduct_scene_description_length_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.phone(input)) != null) {
      template.text = "addproduct_scene_description_checker_phone_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.url(input)) != null) {
      template.text = "addproduct_scene_description_checker_url_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.description = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const fifthStep = new Composer()
fifthStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_price_message"
    let input = template.ctx.message.text

    if (input.split(" ").length > 10) {
      template.text = "addproduct_scene_tags_length_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.phone(input)) != null) {
      template.text = "addproduct_scene_tags_checker_phone_error_checks"

      return await template.replyWithHTML()
    }

    if ((await template.checker.url(input)) != null) {
      template.text = "addproduct_scene_tags_checker_url_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.tags = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const sixthStep = new Composer()
sixthStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_delivery_product_message"
    let input = template.ctx.message.text

    if (!validator.isFloat(input) || !validator.isNumeric(input) || input < 0) {
      template.text = "addproduct_scene_price_numericfloat_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.price = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const deliveryStep = new Composer()
deliveryStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_currency_product_message"
    let input = template.ctx.message.text

    let currency = await template.status.currency()

    await template.generateButton(3, currency, "currencies")

    if (!validator.isFloat(input) || !validator.isNumeric(input) || input < 0) {
      template.text = "addproduct_scene_delivery_numericfloat_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.delivery = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.error(e)
  }
})

const seventhStep = new Composer()
seventhStep.action(/currencies_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_count_product_message"

    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    template.ctx.wizard.state.data.currency = callback.update[1]

    await template.editMessageText()

    await template.ctx.wizard.next()
  } catch (e) {
    console.log(e)
  }
})

const eighthStep = new Composer()
eighthStep.on("text", async ctx => {
  try {
    const template = new Template(ctx)

    template.text = "addproduct_scene_confirm_product_message"
    let input = template.ctx.message.text

    await template.generateButton(2, ["yes", "no"], "confirm")

    if (!validator.isNumeric(input) || input <= 0) {
      template.text = "addproduct_scene_count_numeric_error_checks"

      return await template.replyWithHTML()
    }

    template.ctx.wizard.state.data.count = input

    await template.replyWithHTML()

    await template.ctx.wizard.next()
  } catch (e) {
    console.log(e)
  }
})

const ninthStep = new Composer()
ninthStep.action(/confirm_(yes|no)_(.+)/, async ctx => {
  try {
    const template = new Template(ctx)
    if (typeof (await template.protect.callback(ctx)) != "object") return
    let callback = await template.protect.callback(ctx)

    if (callback.update[1] == "yes") {
      if (
        template.ctx.session.startdate.add("20", "h").valueOf() >
        moment().valueOf()
      ) {
        let product = new template.ctx.db.Product()
        product.user = template.ctx.session.user._id
        product.name = template.ctx.wizard.state.data.name.replace(/  +/g, " ")
        product.description =
          template.ctx.wizard.state.data.description.replace(/  +/g, " ")
        product.tags = template.ctx.wizard.state.data.tags.replace(/  +/g, " ")
        product.price = template.ctx.wizard.state.data.price.replace(
          /  +/g,
          " "
        )
        product.delivery = template.ctx.wizard.state.data.delivery.replace(
          /  +/g,
          " "
        )
        product.media = template.ctx.wizard.state.data.media
        product.count = template.ctx.wizard.state.data.count
        product.status = 0
        product.currency = template.ctx.wizard.state.data.currency
        await product.save()
        template.text = "addproduct_scene_success_checks"
      } else {
        template.text = "addproduct_scene_alotoftime_error_checks"
      }
    } else {
      template.text = "addproduct_scene_cancel_checks"
    }

    await template.editMessageText()

    await template.ctx.scene.leave()
  } catch (e) {
    console.error(e)
  }
})

const scene = new Scenes.WizardScene(
  "addproduct",
  firstStep,
  secondStep,
  thirdStep,
  fourthStep,
  fifthStep,
  sixthStep,
  deliveryStep,
  seventhStep,
  eighthStep,
  ninthStep
)

module.exports = scene
