const mongoose = require("mongoose");

module.exports.connectToMongoDb = async () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb+srv://Sousse:JYb3FbFG4yJptGSu@cluster0.fmo58qd.mongodb.net/")
    .then(() => {
      console.log("connect ot db");
    })
    .catch((error) => {
      console.log(error);
    });
}
