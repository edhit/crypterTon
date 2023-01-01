const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    uuid: String,
    amount: Number,
    price: Number,
    fee: Number,
    status: Number,
    payment_status: Number,
    wallet: { type: Schema.Types.ObjectId, ref: "Address" },
  },
  {
    timestamps: true,
  }
)

module.exports = schema
