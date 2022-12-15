const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  {
    timestamps: true,
  }
)

module.exports = schema
