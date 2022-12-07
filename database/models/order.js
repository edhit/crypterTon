const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: Number,
    product: String,
    uuid: String,
    amount: Number,
    price: Number,
    status: Number,
    payment_status: Number,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
