const mongoose = require("mongoose");


async function dbConnection() {
  const url = process.env.MONGODB_URL;

    await mongoose.connect(url).then(()=>{
      console.log("Database connected");
    })
    return;
}

module.exports = dbConnection;
