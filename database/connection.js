require("dotenv").config()
const mongoose = require("mongoose")

const connection = mongoose.createConnection(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

module.exports = connection
