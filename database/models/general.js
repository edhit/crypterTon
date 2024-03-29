const { Schema } = require("mongoose")

const schema = new Schema(
  {
    id: String,
    coins: Object,
    toncoin: Object,
    fee: Number,
    currency: String,
    date: String,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
