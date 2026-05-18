const mongoose = require("mongoose")

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log(" Connected to database")
  } 
  catch (err) {
    console.log(" Database connection error:")
    console.log(err.message)

    process.exit(1)
  }
}

module.exports = connectToDB