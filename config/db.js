const mongoose = require("mongoose");

const connectDB=() => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
      .then(console.log("Database Connected😁"))
      .catch(error => {
        console.log("DB CONNECTION ISSUES!😒");
        console.log(error);
        process.exit(1);
      })
}

module.exports = connectDB;