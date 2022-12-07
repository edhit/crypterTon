const QRCode = require("qrcode")

const create = async string => {
  try {
    let qrcode = await QRCode.toDataURL(string, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      width: 500,
    })
    qrcode = Buffer.from(qrcode.split(",")[1], "base64")
    return qrcode
  } catch (e) {
    console.log(e)
  }
}

module.exports = { create }
