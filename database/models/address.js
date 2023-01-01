const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    wallet: Object,
    uuid: String,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
