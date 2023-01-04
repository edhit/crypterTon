const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: Number,
    username: String,
    wallet: String,
    language: { type: String, lowercase: true, trim: true },
    currency: { type: String, lowercase: true, trim: true },
    role: { type: String, lowercase: true, trim: true },
    refferal: Number,
    privacy: Object,
    ban: Number,
  },
  {
    timestamps: true,
  }
)

module.exports = schema
