const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    uuid: String,
    amount: Number,
    price: Number,
    status: Number,
    payment_status: Number,
    toncoin: Object,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
