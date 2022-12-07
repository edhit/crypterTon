const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: Number,
    product: String,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
