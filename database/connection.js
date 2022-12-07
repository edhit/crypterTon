const mongoose = require("mongoose")

require("dotenv").config()

const connection = mongoose.createConnection(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

module.exports = connection
