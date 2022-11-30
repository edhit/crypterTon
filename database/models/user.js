const {
  Schema
} = require("mongoose");

const schema = new Schema({
  user: Number,
  username: String,
  address: String,
  language: { type: String, lowercase: true, trim: true },
  currency: { type: String, lowercase: true, trim: true },
  role: { type: String, lowercase: true, trim: true },
  rate: Array,
  refferal: Number,
  ban: Number
}, {
  timestamps: true
});

module.exports = schema
