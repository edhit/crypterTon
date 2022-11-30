const {
  Schema
} = require("mongoose");

const schema = new Schema({
  user: Number,
  product: String,
  uuid: String,
  price: Number,
  status: Number,
  payment_status: Number,
  address: String,
  keys: Object
}, {
  timestamps: true
});

module.exports = schema
