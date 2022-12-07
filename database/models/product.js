const { Schema } = require("mongoose")

const schema = new Schema(
  {
    user: Number,
    shortId: String,
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    tags: { type: String, lowercase: true, trim: true },
    price: Number,
    media: Array,
    checks: { type: String, lowercase: true, trim: true },
    currency: { type: String, lowercase: true, trim: true },
    status: Number,
    rate: Number,
  },
  {
    timestamps: true,
  }
)

schema.index({ name: "text", description: "text", tags: "text" })

module.exports = schema
