const QRCode = require("qrcode")

class QR {
  async create(string) {
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
}

module.exports = QR
